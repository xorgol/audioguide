import sys
import json
import os
import re

try:
    import whisper
    from whisper.utils import get_writer
except ImportError:
    print("Error: 'openai-whisper' not installed. Install it with: pip install openai-whisper")
    sys.exit(1)

def generate_captions(audio_path, output_dir):
    print(f"Loading 'large-v3' Whisper model (this is the most accurate model and may take a moment)...")
    # Using 'large-v3' for best possible transcription as requested
    model = whisper.load_model("large-v3")
    
    print(f"Processing {audio_path} in Italian...")
    options = {
        "word_timestamps": True,
        "language": "it"
    }

    result = model.transcribe(audio_path, **options)
    
    # Pre-process whisper words to merge apostrophes (e.g., dell' + opera = dell'opera)
    print("Merging Italian apostrophes...")
    final_words = []
    
    for segment in result['segments']:
        if 'words' in segment:
            for word in segment['words']:
                text = word['word'].strip()
                # Ensure we handle potential numpy types from some whisper versions
                start = float(word['start'])
                end = float(word['end'])
                
                if final_words and (text.startswith("'") or text.startswith("’") or 
                                 final_words[-1]['word'].endswith("'") or 
                                 final_words[-1]['word'].endswith("’")):
                    final_words[-1]['word'] += text
                    final_words[-1]['end'] = end
                else:
                    final_words.append({
                        'word': text,
                        'start': start,
                        'end': end
                    })

    # 1. Generate JSON Timing (for Karaoke UI)
    print("Generating JSON timing...")
    json_output = {
        'text': result['text'],
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
        # Group into segments of ~10 words for readability
        for i in range(0, len(final_words), 10):
            chunk = final_words[i:i+10]
            start_t = self_format_timestamp(chunk[0]['start'])
            end_t = self_format_timestamp(chunk[-1]['end'])
            text = " ".join([w['word'] for w in chunk])
            # Handle Italian apostrophe spacing in chunk string
            text = text.replace("' ", "'").replace("’ ", "’")
            f.write(f"{start_t} --> {end_t}\n{text}\n\n")
    
    print(f"Done! Created timing.json and {os.path.basename(vtt_path)} using large-v3.")

def self_format_timestamp(seconds):
    td_msec = int((seconds - int(seconds)) * 1000)
    td_sec = int(seconds) % 60
    td_min = int(seconds // 60) % 60
    td_hr = int(seconds // 3600)
    return f"{td_hr:02d}:{td_min:02d}:{td_sec:02d}.{td_msec:03d}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_captions.py <audio_file>")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File {audio_file} not found.")
        sys.exit(1)
        
    generate_captions(audio_file, ".")
