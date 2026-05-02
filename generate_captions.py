import sys
import json
import os
import difflib
import re

try:
    import whisper
    from whisper.utils import get_writer
except ImportError:
    print("Error: 'openai-whisper' not installed. Install it with: pip install openai-whisper")
    sys.exit(1)

def clean_word(w):
    """Normalize word for matching: lowercase and remove punctuation."""
    return re.sub(r'[^\w\s]', '', w).lower()

def align_words(ref_text, whisper_words):
    """
    Aligns reference text words with whisper timestamps.
    Returns a list of word objects with reference spelling and whisper timing.
    """
    # Important: some whisper implementations return numpy types which JSON won't like
    def to_float(val):
        try: return float(val)
        except: return 0.0

    ref_words = ref_text.split()
    
    # Pre-process whisper words to merge apostrophes
    merged_whisper = []
    for w in whisper_words:
        text = w['word'].strip()
        start = to_float(w['start'])
        end = to_float(w['end'])
        
        if merged_whisper and (text.startswith("'") or text.startswith("’") or 
                              merged_whisper[-1]['word'].endswith("'") or 
                              merged_whisper[-1]['word'].endswith("’")):
            merged_whisper[-1]['word'] += text
            merged_whisper[-1]['end'] = end
        else:
            merged_whisper.append({'word': text, 'start': start, 'end': end})
    
    ref_norm = [clean_word(w) for w in ref_words]
    whk_norm = [clean_word(w['word']) for w in merged_whisper]
    
    matcher = difflib.SequenceMatcher(None, ref_norm, whk_norm)
    aligned_data = []
    
    last_end_time = 0.0
    
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'equal':
            # Perfect match
            for i, j in zip(range(i1, i2), range(j1, j2)):
                aligned_data.append({
                    'word': ref_words[i],
                    'start': merged_whisper[j]['start'],
                    'end': merged_whisper[j]['end']
                })
                last_end_time = merged_whisper[j]['end']
        else:
            # Gaps or mismatches: estimate timing
            r_segment = ref_words[i1:i2]
            w_segment = merged_whisper[j1:j2]
            
            if not r_segment: continue
            
            # Find start and end times for this block
            block_start = last_end_time
            if w_segment:
                block_start = w_segment[0]['start']
            
            # Find the next available timestamp
            if j2 < len(merged_whisper):
                block_end = merged_whisper[j2]['start']
            elif w_segment:
                block_end = w_segment[-1]['end']
            else:
                block_end = block_start + 1.0 # Fallback
            
            duration = (max(block_end, block_start + 0.1) - block_start) / len(r_segment)
            for idx, r_word in enumerate(r_segment):
                s = block_start + idx * duration
                e = block_start + (idx + 1) * duration
                aligned_data.append({
                    'word': r_word,
                    'start': s,
                    'end': e
                })
                last_end_time = e
                
    return aligned_data

def generate_captions(audio_path, output_dir, reference_text=None):
    print(f"Loading 'medium' Whisper model...")
    model = whisper.load_model("medium")
    
    print(f"Processing {audio_path} in Italian...")
    options = {"word_timestamps": True, "language": "it"}
    if reference_text:
        options["initial_prompt"] = reference_text[:1000]

    result = model.transcribe(audio_path, **options)
    
    raw_whisper_words = []
    for segment in result['segments']:
        if 'words' in segment:
            raw_whisper_words.extend(segment['words'])

    if reference_text:
        print("Performing forced alignment with reference text...")
        final_words = align_words(reference_text, raw_whisper_words)
    else:
        print("Using Whisper transcription directly...")
        final_words = []
        for w in raw_whisper_words:
            text = w['word'].strip()
            start = float(w['start'])
            end = float(w['end'])
            if final_words and (text.startswith("'") or text.startswith("’") or 
                               final_words[-1]['word'].endswith("'") or 
                               final_words[-1]['word'].endswith("’")):
                final_words[-1]['word'] += text
                final_words[-1]['end'] = end
            else:
                final_words.append({'word': text, 'start': start, 'end': end})

    # 1. Generate JSON Timing
    print("Generating JSON timing...")
    json_output = {
        'text': reference_text if reference_text else result['text'],
        'words': final_words
    }
    
    json_path = os.path.join(output_dir, "timing.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_output, f, indent=2, ensure_ascii=False)

    # 2. Generate VTT Captions
    print("Generating VTT captions...")
    vtt_path = os.path.join(output_dir, os.path.basename(audio_path).replace('.mp3', '.vtt'))
    with open(vtt_path, 'w', encoding='utf-8') as f:
        f.write("WEBVTT\n\n")
        for i in range(0, len(final_words), 10):
            chunk = final_words[i:i+10]
            start_t = self_format_timestamp(chunk[0]['start'])
            end_t = self_format_timestamp(chunk[-1]['end'])
            text = " ".join([w['word'] for w in chunk])
            text = text.replace("' ", "'").replace("’ ", "’")
            f.write(f"{start_t} --> {end_t}\n{text}\n\n")
    
    print(f"Done! Created timing.json and {os.path.basename(vtt_path)}")

def self_format_timestamp(seconds):
    td_msec = int((seconds - int(seconds)) * 1000)
    td_sec = int(seconds) % 60
    td_min = int(seconds // 60) % 60
    td_hr = int(seconds // 3600)
    return f"{td_hr:02d}:{td_min:02d}:{td_sec:02d}.{td_msec:03d}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_captions.py <audio_file> [text_file_for_reference]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    ref_text = None
    
    if len(sys.argv) > 2:
        ref_file = sys.argv[2]
        if os.path.exists(ref_file):
            with open(ref_file, 'r', encoding='utf-8') as f:
                content = f.read()
                try:
                    data = json.loads(content)
                    if isinstance(data, dict) and 'text' in data:
                        ref_text = data['text']
                        print("Detected JSON reference file, extracting 'text' field.")
                    else:
                        ref_text = content
                except json.JSONDecodeError:
                    ref_text = content
    
    generate_captions(audio_file, ".", ref_text)
