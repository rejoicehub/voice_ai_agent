(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.AIVoiceAgentInitialized) {
    return;
  }
  window.AIVoiceAgentInitialized = true;

  // Load GSAP if not already loaded
  function loadGSAP(callback) {
    if (window.gsap) {
      // Wait a bit to ensure GSAP is fully initialized
      setTimeout(callback, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = function() {
      // Wait for GSAP to be fully available
      setTimeout(callback, 200);
    };
    script.onerror = function() {
      console.error('Failed to load GSAP library');
      callback(); // Continue without GSAP
    };
    document.head.appendChild(script);
  }

  // Load Google Fonts
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2?family=Poppins"]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // Inject keyframes, as they cannot be inlined
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes soft-movement {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
      }
      @keyframes wave-pulse {
        0% {
          width: 70%;
          height: 70%;
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(0.8);
        }
        100% {
          width: 120%;
          height: 120%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.2);
        }
      }
      @keyframes globe-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Create HTML structure with inline CSS
  function createHTML() {
    const container = document.createElement('div');
    container.id = 'ai-voice-agent-container';
    container.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Poppins', sans-serif;";

    container.innerHTML = `
      <div id="connectionOrb" style="margin: 0; padding: 0; box-sizing: border-box; position: relative; z-index: 5; cursor: pointer;">
        <div id="connectionButtonMain" style="margin: 0; padding: 0; box-sizing: border-box; display: flex; align-items: center; border: none; border-radius: 50px; gap: 10px; padding-right: 10px; background-color: #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;">
          <div style="margin: 0; padding: 0; box-sizing: border-box; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f77f00, #fcbf49); box-shadow: 0 0 20px rgba(247, 91, 28, 0.5); display: flex; justify-content: center; align-items: center; position: relative;">
            <svg viewBox="0 0 100 100" style="margin: 0; padding: 0; box-sizing: border-box; width: 40px; height: 40px; animation: globe-rotate 60s linear infinite; transform-origin: center;">
                <g style="margin: 0; padding: 0; box-sizing: border-box;">
                  <circle cx="50" cy="15" r="3" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="75" cy="25" r="2.5" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="85" cy="50" r="3" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="75" cy="75" r="2.5" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="50" cy="85" r="3" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="25" cy="75" r="2.5" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="15" cy="50" r="3" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <circle cx="25" cy="25" r="2.5" style="fill: #ffffff; filter: drop-shadow(0 0 3px rgba(247, 127, 0, 0.8));" />
                  <line x1="50" y1="15" x2="75" y2="25" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="75" y1="25" x2="85" y2="50" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="85" y1="50" x2="75" y2="75" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="75" y1="75" x2="50" y2="85" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="50" y1="85" x2="25" y2="75" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="25" y1="75" x2="15" y2="50" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="15" y1="50" x2="25" y2="25" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                  <line x1="25" y1="25" x2="50" y2="15" style="stroke: #ffffff; stroke-width: 1; opacity: 0.6;"/>
                </g>
            </svg>
          </div>
          <div style="margin: 0; padding: 0; box-sizing: border-box;">
            <span id="connectTextSpan" style="margin: 0; padding: 0; box-sizing: border-box; display: inline-block; font-size: 16px; font-weight: 600; line-height: 20px; background: linear-gradient(135deg, #f77f00, #fcbf49); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; text-transform: capitalize; transition: all 0.3s ease;">AI Voice Agent</span>
          </div>
        </div>
      </div>
      
      <div id="chatSessionModal" style="margin: 0; padding: 20px; box-sizing: border-box; position: fixed; bottom: 85px; right: 20px; width: 320px; height: 420px; background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(15px) saturate(180%); -webkit-backdrop-filter: blur(15px) saturate(180%); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.125); display: flex; flex-direction: column; justify-content: space-evenly; align-items: center; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);">
          <div id="status" style="margin: 0; padding: 0; box-sizing: border-box; position: relative; text-align: center;">
            <div id="statusText" style="margin: 0 0 5px 0; padding: 0; box-sizing: border-box; font-size: 1.2rem; font-weight: 600; color: #ffffff;"></div>
            <div id="statusSubtext" style="margin: 0; padding: 0; box-sizing: border-box; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);"></div>
          </div>
          <div id="voiceChatView" style="margin: 0; padding: 0; box-sizing: border-box; position: relative; width: 200px; height: 200px; display: flex; justify-content: center; align-items: center;">
              <div style="margin: 0; padding: 0; box-sizing: border-box; width: 65%; height: 65%; background-color: #f5f5f5; border-radius: 50%; box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3); position: relative; animation: soft-movement 8s ease-in-out infinite alternate;"></div>
              <div id="voiceWaves" style="margin: 0; padding: 0; box-sizing: border-box; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
                  <div class="wave" style="margin: 0; padding: 0; box-sizing: border-box; position: absolute; top: 50%; left: 50%; border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.8); width: 70%; height: 70%;"></div>
                  <div class="wave" style="margin: 0; padding: 0; box-sizing: border-box; position: absolute; top: 50%; left: 50%; border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.8); width: 70%; height: 70%;"></div>
                  <div class="wave" style="margin: 0; padding: 0; box-sizing: border-box; position: absolute; top: 50%; left: 50%; border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.8); width: 70%; height: 70%;"></div>
              </div>
              <div id="speakerBubbles" style="margin: 0; padding: 0; box-sizing: border-box; position: absolute; width: 100%; height: 100%;"></div>
          </div>
          <button id="disconnectButton" style="margin: 0; padding: 10px 25px; box-sizing: border-box; position: relative; width: auto; background: linear-gradient(135deg, #f77f00, #fcbf49); border: none; outline: none; border-radius: 30px; color: #ffffff; font-family: 'Poppins', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.3s ease-in-out;">End Call</button>
      </div>
        
      <div id="errorMessage" style="margin: 0; padding: 15px 25px; box-sizing: border-box; position: fixed; bottom: 20px; left: 20px; width: calc(100% - 40px); max-width: 350px; background: rgba(214, 40, 40, 0.2); backdrop-filter: blur(10px); color: #ffffff; border-radius: 30px; border: 1px solid rgba(214, 40, 40, 0.3); z-index: 10000; opacity: 0; visibility: hidden; transition: all 0.3s ease;"></div>
    `;

    document.body.appendChild(container);
    return container;
  }


  // Initialize the voice agent
  function initializeVoiceAgent() {
    const container = createHTML();

    // DOM Elements
    const connectionOrb = document.getElementById("connectionOrb");
    const connectionButtonMain = document.getElementById("connectionButtonMain");
    const connectTextSpan = document.getElementById("connectTextSpan");
    const chatSessionModal = document.getElementById("chatSessionModal");
    const status = document.getElementById("status");
    const statusText = document.getElementById("statusText");
    const statusSubtext = document.getElementById("statusSubtext");
    const disconnectButton = document.getElementById("disconnectButton");
    const errorMessage = document.getElementById("errorMessage");
    const speakerBubbles = document.getElementById("speakerBubbles");

    // State variables
    let isActive = false;
    let isConnecting = false;
    let waveAnimation = null;

    class VoiceCallClient {
        // ... (The VoiceCallClient class remains unchanged as it handles logic, not styling)
        constructor() {
        this.ws = null;
        this.mediaStream = null;
        this.audioContext = null;
        this.processor = null;
        this.source = null;
        this.isConnected = false;
        this.audioQueue = [];
        this.isPlaying = false;
        this.currentSource = null;
      }

      async startCall() {
        try {
          // Get media stream with validation
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 48000,
              channelCount: 1
            },
          });

          if (!this.mediaStream) {
            throw new Error('Failed to get media stream');
          }

          // Create audio context with validation
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) {
            throw new Error('Web Audio API is not supported');
          }

          this.audioContext = new AudioContextClass({
            sampleRate: 48000,
            latencyHint: "interactive"
          });

          if (!this.audioContext) {
            throw new Error('Failed to create audio context');
          }

          if (this.audioContext.state === "suspended") {
            await this.audioContext.resume();
          }

          // Create WebSocket with validation
          const wsUrl = `wss://python.callai.rejoicehub.com/ws/web-call?agent_id=agent_01jz81x78pezzsbexr67b1qxd4`;
          this.ws = new WebSocket(wsUrl);

          if (!this.ws) {
            throw new Error('Failed to create WebSocket connection');
          }

          this.ws.onopen = () => this.handleWebSocketOpen();
          this.ws.onmessage = (event) => this.handleWebSocketMessage(event);
          this.ws.onerror = (error) => this.handleWebSocketError(error);
          this.ws.onclose = () => this.handleWebSocketClose();

        } catch (error) {
          console.error("Error starting call:", error);
          showError("Failed to start call: " + error.message);
          this.cleanup(); // Clean up any partial state
          throw error;
        }
      }

      handleWebSocketOpen() {
        this.isConnected = true;
        console.log("WebSocket connection established");
        this.startAudioProcessing();
        this.ws.send(JSON.stringify({ type: "config", sampleRate: 48000 }));
      }

      handleWebSocketMessage(event) {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "audio":
              this.queueAudio(data.audio);
              break;
            case "transcript":
              showSpeakerIndicator(data.data.speaker);
              break;
            case "clear_audio":
              this.clearAudioQueue();
              break;
            case "error":
              showError(data.message);
              break;
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      }

      handleWebSocketError(error) {
        console.error("WebSocket error:", error);
        showError("Connection error occurred");
      }

      handleWebSocketClose() {
        this.isConnected = false;
        console.log("WebSocket connection closed");
        if (isActive) {
          disconnect();
        }
      }

      startAudioProcessing() {
        try {
          if (!this.mediaStream || !this.audioContext) {
            throw new Error('Media stream or audio context not available');
          }

          this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
          if (!this.source) {
            throw new Error('Failed to create media stream source');
          }

          const bufferSize = 2048;

          // Check if createScriptProcessor is available
          if (this.audioContext.createScriptProcessor) {
            this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
          } else {
            throw new Error('Script processor not supported');
          }

          if (!this.processor) {
            throw new Error('Failed to create script processor');
          }

          this.source.connect(this.processor);
          this.processor.connect(this.audioContext.destination);

          this.processor.onaudioprocess = (e) => {
            if (!this.isConnected || !e.inputBuffer) return;

            try {
              const inputData = e.inputBuffer.getChannelData(0);
              if (!inputData || inputData.length === 0) return;

              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
              }

              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: "audio", audio: base64 }));
              }
            } catch (error) {
              console.error('Audio processing error:', error);
            }
          };
        } catch (error) {
          console.error('Error starting audio processing:', error);
          showError('Failed to start audio processing: ' + error.message);
        }
      }

      clearAudioQueue() {
        this.audioQueue = [];
        if (this.currentSource) {
          try {
            if (this.currentSource.buffer) {
              this.currentSource.stop();
            }
            this.currentSource.disconnect();
          } catch (e) {
            // Ignore errors during cleanup
          }
          this.currentSource = null;
        }
        this.isPlaying = false;
      }

      queueAudio(audioBase64) {
        this.audioQueue.push(audioBase64);
        if (!this.isPlaying) {
          this.playNextAudio();
        }
      }

      async playNextAudio() {
        if (this.audioQueue.length === 0) {
          this.isPlaying = false;
          showSpeakerIndicator("none");
          return;
        }
        this.isPlaying = true;
        const audioBase64 = this.audioQueue.shift();

        try {
          // Validate input
          if (!audioBase64 || typeof audioBase64 !== 'string') {
            throw new Error('Invalid audio data received');
          }

          // Validate audio context
          if (!this.audioContext || this.audioContext.state === 'closed') {
            throw new Error('Audio context is not available');
          }

          // Resume audio context if suspended
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }

          const binaryString = atob(audioBase64);
          if (binaryString.length === 0) {
            throw new Error('Empty audio data');
          }

          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Validate byte array
          if (bytes.length === 0 || bytes.length % 2 !== 0) {
            throw new Error('Invalid audio buffer size');
          }

          const int16Array = new Int16Array(bytes.buffer);
          const float32Array = new Float32Array(int16Array.length);

          // Convert to float32 with validation
          for (let i = 0; i < int16Array.length; i++) {
            const sample = int16Array[i] / 32768.0;
            float32Array[i] = Math.max(-1, Math.min(1, sample)); // Clamp values
          }

          // Validate array length
          if (float32Array.length === 0) {
            throw new Error('No audio samples to play');
          }

          // Create audio buffer with validation
          const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 48000);
          if (!audioBuffer) {
            throw new Error('Failed to create audio buffer');
          }

          const channelData = audioBuffer.getChannelData(0);
          if (!channelData) {
            throw new Error('Failed to get channel data');
          }

          channelData.set(float32Array);

          // Create and configure buffer source
          this.currentSource = this.audioContext.createBufferSource();
          if (!this.currentSource) {
            throw new Error('Failed to create buffer source');
          }

          this.currentSource.buffer = audioBuffer;
          this.currentSource.connect(this.audioContext.destination);

          this.currentSource.onended = () => {
            this.currentSource = null;
            this.playNextAudio();
          };

          this.currentSource.onerror = (error) => {
            console.error('Audio source error:', error);
            this.currentSource = null;
            this.playNextAudio();
          };

          this.currentSource.start();

        } catch (error) {
          console.error("Error playing audio:", error);
          if (this.currentSource) {
            try {
              this.currentSource.disconnect();
            } catch (e) {
              // Ignore disconnect errors
            }
            this.currentSource = null;
          }
          // Continue with next audio
          this.playNextAudio();
        }
      }

      endCall() {
        this.isConnected = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
        }
        this.cleanup();
      }

      cleanup() {
        this.clearAudioQueue();
        if (this.processor) {
          this.processor.disconnect();
          this.processor = null;
        }
        if (this.source) {
          this.source.disconnect();
          this.source = null;
        }
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }
        if (this.audioContext && this.audioContext.state !== "closed") {
          this.audioContext.close();
          this.audioContext = null;
        }
        this.audioQueue = [];
        this.isPlaying = false;
      }
    }

    const voiceClient = new VoiceCallClient();

    connectionOrb.addEventListener("click", () => {
      if (!isActive && !isConnecting) {
        startVoiceChat();
      }
    });

    disconnectButton.addEventListener("click", () => {
      disconnect();
    });

    // Handle hover effect for disconnect button
    const originalBg = 'linear-gradient(135deg, #f77f00, #fcbf49)';
    const hoverBg = 'linear-gradient(135deg, #fcbf49, #f77f00)';

    disconnectButton.addEventListener('mouseover', () => {
      disconnectButton.style.background = hoverBg;
    });
    disconnectButton.addEventListener('mouseout', () => {
      disconnectButton.style.background = originalBg;
    });

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.opacity = '1';
      errorMessage.style.visibility = 'visible';
      setTimeout(() => {
        errorMessage.style.opacity = '0';
        errorMessage.style.visibility = 'hidden';
      }, 5000);
    }

    function updateStatus(mainText, subText) {
      statusText.textContent = mainText;
      statusSubtext.textContent = subText;
    }

    function startVoiceChat() {
      if (isConnecting) return;
      isConnecting = true;

      // Animate button collapse
      connectTextSpan.style.fontSize = '0px';
      connectTextSpan.style.opacity = '0';
      connectionButtonMain.style.paddingRight = '0px';
      connectionButtonMain.style.width = '50px';

      // Show modal
      chatSessionModal.style.opacity = '1';
      chatSessionModal.style.visibility = 'visible';
      chatSessionModal.style.transform = 'translateY(0px)';

      updateStatus("Connecting...", "Please wait");

      voiceClient.startCall()
        .then(() => {
          isConnecting = false;
          isActive = true;
          updateStatus("Connected", "You can start speaking now");
          startWaveAnimation();
        })
        .catch((error) => {
          showError("Failed to start call: " + error.message);
          disconnect();
        });
    }

    console.log("Voice client initialized");

    function disconnect() {
      isActive = false;
      isConnecting = false;
      voiceClient.endCall();

      // Animate button expand
      connectTextSpan.style.fontSize = '16px';
      connectTextSpan.style.opacity = '1';
      connectionButtonMain.style.paddingRight = '10px';
      connectionButtonMain.style.width = 'auto';

      // Hide modal
      chatSessionModal.style.opacity = '0';
      chatSessionModal.style.visibility = 'hidden';
      chatSessionModal.style.transform = 'translateY(20px)';

      stopWaveAnimation();
      showSpeakerIndicator("none");
    }

    function startWaveAnimation() {
      if (waveAnimation) waveAnimation.kill();

      const voiceWaves = container.querySelector("#voiceWaves");

      // Try GSAP first, fallback to CSS animation
      if (window.gsap && window.gsap.timeline) {
        try {
          waveAnimation = window.gsap.timeline({
            repeat: -1
          });
          const waves = container.querySelectorAll(".wave");

          waves.forEach((wave, index) => {
            waveAnimation.fromTo(wave, {
              width: "70%",
              height: "70%",
              opacity: 0.7,
              scale: 0.8
            }, {
              width: "120%",
              height: "120%",
              opacity: 0,
              scale: 1.2,
              duration: 3,
              ease: "power1.out"
            }, index * 1);
          });

          console.log("GSAP wave animation started");
          return;
        } catch (error) {
          console.warn("GSAP animation failed, using CSS fallback:", error);
        }
      }

      // CSS animation fallback
      const waves = container.querySelectorAll(".wave");
      waves.forEach((wave, index) => {
        wave.style.animation = `wave-pulse 3s ease-out infinite`;
        wave.style.animationDelay = `${index}s`;
      });
      console.log("CSS wave animation started");
    }

    function stopWaveAnimation() {
      if (waveAnimation) {
        waveAnimation.kill();
        waveAnimation = null;
      }

      // Also stop CSS animation
      const waves = container.querySelectorAll(".wave");
      if (waves) {
        waves.forEach(wave => {
          wave.style.animation = 'none';
          wave.style.animationDelay = '0s';
        });
      }
    }

    function showSpeakerIndicator(speaker) {
      speakerBubbles.innerHTML = '';
      if (speaker === 'none') return;

      const bubble = document.createElement('div');
      // Base styles
      bubble.style.cssText = "width: 25px; height: 25px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.3s ease; box-sizing: border-box;";

      if (speaker === 'user') {
        bubble.style.backgroundColor = '#fcbf49'; // --secondary
        bubble.style.boxShadow = '0 0 15px #fcbf49';
      } else {
        bubble.style.backgroundColor = '#f77f00'; // --primary
        bubble.style.boxShadow = '0 0 15px #f77f00';
      }
      speakerBubbles.appendChild(bubble);

      if (window.gsap) {
        window.gsap.to(bubble, {
          opacity: 1,
          duration: 0.3
        });
      } else {
        // Use a slight timeout to ensure CSS transition triggers
        setTimeout(() => {
            bubble.style.opacity = '1';
        }, 10);
      }
    }
  }

  // Main initialization function
  function init() {
    loadGoogleFonts();
    injectStyles();

    loadGSAP(function() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeVoiceAgent);
      } else {
        initializeVoiceAgent();
      }
    });
  }

  // Start initialization
  init();

})();