import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Speech from 'speak-tts';

@Injectable({ providedIn: 'root' })
export class TextToSpeechService {
  speech = new Speech();

  speechStart: Subject<boolean> = new Subject();
  speechEnd: Subject<boolean> = new Subject();

  constructor() {
    this.init();
  }

  private init() {
    this.speech.init().then((data) => {

      console.log('Speech is ready, voices are available', data);
    }).catch(e => {
      console.error('An error occured while initializing : ', e);
    });
  }

  speak(message: string, voiceType: string, languageType?:string) {
    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = languageType? languageType: 'en-GB';
      utterance.voice = this.getVoiceByType(voiceType);
  
      utterance.addEventListener('start', () => {
        this.speechStart.next(true);
      });
      utterance.addEventListener('end', () => {
        this.speechEnd.next(true);
        console.log('End utterance');
        resolve(); // resolve the promise when speech is done
      });
  
      speechSynthesis.speak(utterance);
    });
  }
  
  getVoiceByType(voiceType: string): SpeechSynthesisVoice {
    const voices = speechSynthesis.getVoices();
    return voices.find(voice => voice.name === voiceType);
  }

}
