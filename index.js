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
      callback();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load GSAP library');
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

  // Inject CSS styles
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #f77f00;
        --secondary: #fcbf49;
        --accent: #d62828;
        --light: #f8fafc;
        --dark: #1e293b;
        --white: #ffffff;
        --pulse-color: rgba(247, 127, 0, 0.8);
        --color-orange-dark: 247, 91, 28;
        --color-orange-light: 251, 176, 52;
        --color-black: 10, 10, 10;
        --rotation-duration: 6s;
        --dynamic-border-radius: 55%;
      }

      #ai-voice-agent-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: "Poppins", sans-serif;
      }

      #ai-voice-agent-container * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .connection-orb-main {
        position: relative;
        z-index: 5;
        cursor: pointer;
      }

      .connection-button-main {
        display: flex;
        align-items: center;
        border: none;
        border-radius: 50px;
        gap: 10px;
        padding-right: 10px;
        background-color: #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }

      .connect-text span {
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        text-transform: capitalize;
        transition: all 0.3s ease;
      }
      
      .chat-active .connect-text span {
          font-size: 0px;
          opacity: 0;
      }
       .chat-active .connection-button-main {
           padding-right: 0;
           width: 50px;
       }

      .connection-orb {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        box-shadow: 0 0 20px rgba(var(--color-orange-dark), 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      
      .connection-orb svg {
        width: 40px;
        height: 40px;
      }

      .chat-session-modal {
        position: fixed;
        bottom: 85px;
        right: 20px;
        width: 320px;
        height: 420px;
        background: rgba(30, 41, 59, 0.8);
        backdrop-filter: blur(15px) saturate(180%);
        -webkit-backdrop-filter: blur(15px) saturate(180%);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.125);
        
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        padding: 20px;

        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      }
      
      .chat-session-modal.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
      }

      .voice-chat-view {
        position: relative;
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .voice-glob {
        width: 65%;
        height: 65%;
        background-color: #f5f5f5;
        border-radius: 50%;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.3);
        position: relative;
        animation: soft-movement 8s ease-in-out infinite alternate;
      }

      @keyframes soft-movement {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
      }

      .voice-waves {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
      }

      .voice-waves .wave {
        position: absolute;
        top: 50%;
        left: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
      
      .speaker-bubbles {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .speaker-bubbles .bubble {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .speaker-bubbles .ai-speaker {
        background-color: var(--primary);
        box-shadow: 0 0 15px var(--primary);
      }

      .speaker-bubbles .user-speaker {
        background-color: var(--secondary);
        box-shadow: 0 0 15px var(--secondary);
      }
      
      .status {
          position: relative;
          text-align: center;
      }

      .status-text {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--white);
        margin-bottom: 5px;
      }

      .status-subtext {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
      }

      .connection-orb-waves-main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .disconnect-button {
        position: relative;
        width: auto;
        padding: 10px 25px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border: none;
        outline: none;
        border-radius: 30px;
        color: var(--white);
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
      }

      .disconnect-button:hover {
        background: linear-gradient(135deg, var(--secondary), var(--primary));
      }
      
      .error-message {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: calc(100% - 40px);
        max-width: 350px;
        background: rgba(214, 40, 40, 0.2);
        backdrop-filter: blur(10px);
        color: var(--white);
        padding: 15px 25px;
        border-radius: 30px;
        border: 1px solid rgba(214, 40, 40, 0.3);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      .error-message.visible {
          opacity: 1;
          visibility: visible;
      }
      
      .neuron {
        fill: var(--white);
        filter: drop-shadow(0 0 3px var(--pulse-color));
      }

      .neuron-connection {
        stroke: var(--white);
        stroke-width: 1;
        opacity: 0.6;
      }
      
      .globe-rotate {
        animation: globe-rotate 60s linear infinite;
        transform-origin: center;
      }

      @keyframes globe-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Create HTML structure
  function createHTML() {
    const container = document.createElement('div');
    container.id = 'ai-voice-agent-container';
    container.innerHTML = `
      <div class="connection-orb-main" id="connectionOrb">
        <div class="connection-button-main">
          <div class="connection-orb">
            <svg viewBox="0 0 100 100" class="globe-rotate">
                <g>
                  <circle class="neuron" cx="50" cy="15" r="3" />
                  <circle class="neuron" cx="75" cy="25" r="2.5" />
                  <circle class="neuron" cx="85" cy="50" r="3" />
                  <circle class="neuron" cx="75" cy="75" r="2.5" />
                  <circle class="neuron" cx="50" cy="85" r="3" />
                  <circle class="neuron" cx="25" cy="75" r="2.5" />
                  <circle class="neuron" cx="15" cy="50" r="3" />
                  <circle class="neuron" cx="25" cy="25" r="2.5" />
                  <line class="neuron-connection" x1="50" y1="15" x2="75" y2="25"/>
                  <line class="neuron-connection" x1="75" y1="25" x2="85" y2="50"/>
                  <line class="neuron-connection" x1="85" y1="50" x2="75" y2="75"/>
                  <line class="neuron-connection" x1="75" y1="75" x2="50" y2="85"/>
                  <line class="neuron-connection" x1="50" y1="85" x2="25" y2="75"/>
                  <line class="neuron-connection" x1="25" y1="75" x2="15" y2="50"/>
                  <line class="neuron-connection" x1="15" y1="50" x2="25" y2="25"/>
                  <line class="neuron-connection" x1="25" y1="25" x2="50" y2="15"/>
                </g>
            </svg>
          </div>
          <div class="connect-text">
            <span>AI Voice Agent</span>
          </div>
        </div>
      </div>
      
      <div class="chat-session-modal" id="chatSessionModal">
          <div class="status" id="status">
            <div class="status-text" id="statusText"></div>
            <div class="status-subtext" id="statusSubtext"></div>
          </div>
          <div class="voice-chat-view" id="voiceChatView">
                <div class="voice-glob"></div>
                <div class="voice-waves" id="voiceWaves">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div>
                <div class="speaker-bubbles" id="speakerBubbles"></div>
          </div>
          <button class="disconnect-button" id="disconnectButton">End Call</button>
      </div>
       
      <div class="error-message" id="errorMessage"></div>
    `;
    
    document.body.appendChild(container);
    return container;
  }

  // Initialize the voice agent
  function initializeVoiceAgent() {
    const container = createHTML();
    
    // DOM Elements
    const connectionOrb = document.getElementById("connectionOrb");
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
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 48000, channelCount: 1, },
          });
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000, latencyHint: "interactive" });
          if (this.audioContext.state === "suspended") { await this.audioContext.resume(); }
          
          this.ws = new WebSocket(`wss://python.callai.rejoicehub.com/ws/web-call?agent_id=agent_01jz81x78pezzsbexr67b1qxd4`);
          this.ws.onopen = () => this.handleWebSocketOpen();
          this.ws.onmessage = (event) => this.handleWebSocketMessage(event);
          this.ws.onerror = (error) => this.handleWebSocketError(error);
          this.ws.onclose = () => this.handleWebSocketClose();
        } catch (error) {
          console.error("Error starting call:", error);
          showError("Failed to start call: " + error.message);
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
            case "audio": this.queueAudio(data.audio); break;
            case "transcript": showSpeakerIndicator(data.data.speaker); break;
            case "clear_audio": this.clearAudioQueue(); break;
            case "error": showError(data.message); break;
          }
        } catch (error) { console.error("Error handling message:", error); }
      }

      handleWebSocketError(error) {
        console.error("WebSocket error:", error);
        showError("Connection error occurred");
      }

      handleWebSocketClose() {
        this.isConnected = false;
        console.log("WebSocket connection closed");
        if (isActive) { disconnect(); }
      }

      startAudioProcessing() {
        this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
        const bufferSize = 2048;
        this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        this.source.connect(this.processor);
        this.processor.connect(this.audioContext.destination);

        this.processor.onaudioprocess = (e) => {
          if (!this.isConnected) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "audio", audio: base64 }));
          }
        };
      }

      clearAudioQueue() {
        this.audioQueue = [];
        if (this.currentSource) {
          try { this.currentSource.stop(); this.currentSource.disconnect(); } catch (e) {}
          this.currentSource = null;
        }
        this.isPlaying = false;
      }

      queueAudio(audioBase64) {
        this.audioQueue.push(audioBase64);
        if (!this.isPlaying) { this.playNextAudio(); }
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
          const binaryString = atob(audioBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
          const int16Array = new Int16Array(bytes.buffer);
          const float32Array = new Float32Array(int16Array.length);
          for (let i = 0; i < int16Array.length; i++) { float32Array[i] = int16Array[i] / 32768.0; }
          const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 48000);
          audioBuffer.getChannelData(0).set(float32Array);
          this.currentSource = this.audioContext.createBufferSource();
          this.currentSource.buffer = audioBuffer;
          this.currentSource.connect(this.audioContext.destination);
          this.currentSource.onended = () => { this.currentSource = null; this.playNextAudio(); };
          this.currentSource.start();
        } catch (error) {
          console.error("Error playing audio:", error);
          this.currentSource = null;
          this.playNextAudio();
        }
      }

      endCall() {
        this.isConnected = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) { this.ws.close(); }
        this.cleanup();
      }

      cleanup() {
        this.clearAudioQueue();
        if (this.processor) { this.processor.disconnect(); this.processor = null; }
        if (this.source) { this.source.disconnect(); this.source = null; }
        if (this.mediaStream) { this.mediaStream.getTracks().forEach((track) => track.stop()); this.mediaStream = null; }
        if (this.audioContext && this.audioContext.state !== "closed") { this.audioContext.close(); this.audioContext = null; }
        this.audioQueue = [];
        this.isPlaying = false;
      }
    }

    const voiceClient = new VoiceCallClient();

    connectionOrb.addEventListener("click", () => {
      if (!isActive && !isConnecting) { startVoiceChat(); }
    });

    disconnectButton.addEventListener("click", () => { disconnect(); });

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.add("visible");
      setTimeout(() => { errorMessage.classList.remove("visible"); }, 5000);
    }
    
    function updateStatus(mainText, subText) {
        statusText.textContent = mainText;
        statusSubtext.textContent = subText;
    }

    function startVoiceChat() {
      if (isConnecting) return;
      isConnecting = true;
      
      connectionOrb.classList.add('chat-active');
      chatSessionModal.classList.add('visible');
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

    function disconnect() {
      isActive = false;
      isConnecting = false;
      voiceClient.endCall();
      
      connectionOrb.classList.remove('chat-active');
      chatSessionModal.classList.remove('visible');
      stopWaveAnimation();
      showSpeakerIndicator("none");
    }

    function startWaveAnimation() {
      if (waveAnimation) waveAnimation.kill();
      if (!window.gsap) return;
      
      waveAnimation = window.gsap.timeline({ repeat: -1 });
      const waves = container.querySelectorAll(".voice-waves .wave");
      waves.forEach((wave, index) => {
        waveAnimation.fromTo(wave,
          { width: "70%", height: "70%", opacity: 0.7, transform: "translate(-50%, -50%) scale(0.8)" },
          { width: "120%", height: "120%", opacity: 0, transform: "translate(-50%, -50%) scale(1.2)", duration: 3, ease: "power1.out" },
          index * 1);
      });
    }

    function stopWaveAnimation() {
      if (waveAnimation) { waveAnimation.kill(); waveAnimation = null; }
    }
    
    function showSpeakerIndicator(speaker) {
          speakerBubbles.innerHTML = '';
          if (speaker === 'none') return;

          const bubble = document.createElement('div');
          bubble.classList.add('bubble');
          if (speaker === 'user') {
              bubble.classList.add('user-speaker');
          } else {
              bubble.classList.add('ai-speaker');
          }
          speakerBubbles.appendChild(bubble);
          
          if (window.gsap) {
            window.gsap.to(bubble, { opacity: 1, duration: 0.3 });
          } else {
            bubble.style.opacity = '1';
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