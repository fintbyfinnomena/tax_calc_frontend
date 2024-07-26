import { createApp } from 'vue'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import extractFundName from './utils/extract.js';
import getChunk from './utils/chunk.js';
import Render from './utils/render.js';

const firebaseConfig = {
  apiKey: "AIzaSyDiJKgpnI9_AOr8mOD21MMUSc60IdAf5nw",
  authDomain: "finnotaxai.firebaseapp.com",
  projectId: "finnotaxai",
  storageBucket: "finnotaxai.appspot.com",
  messagingSenderId: "32636388113",
  appId: "1:32636388113:web:23a10db6c1314b389102b0",
  measurementId: "G-MJ1BBLHN59"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const Vueapp = createApp({
  data() {
    return {
      count: 0,
      messages: [],
      newMessage: '',
      user_obj: {
        id: '',
        name: '',
        email: '',
        profPic: '',
        access_token: '',
      },
      // loading: false,
      streaming: true,
      stream_msg: ''
    }
  },
  mounted: function () {
    this.checkAuth();
  },
  updated() {
    this.scrollToElement();
  },
  methods: {
    checkAuth() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("user is authenticated");
          // const uid = user.uid;
          this.user_obj.id = user.uid;
          this.user_obj.name = user.displayName;
          this.user_obj.email = user.email;
          this.user_obj.profPic = user.photoURL;
          this.user_obj.access_token = user.accessToken;
          this.Clear();
          // ...
        } else {
          // User is signed out
          console.log("user is not authenticated");
          window.location.href = "index.html";
        }
      });
    },
    signout() {
      signOut(auth).then(() => {
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
        // console.log(error);
      });
    },
    scrollToElement() {
      const container = this.$el.querySelector("#chat-container");
      // console.log("scrolling");
      container.scrollTop = container.scrollHeight;
    },
    addMessage() {
      if (this.newMessage.trim() != "") {
        this.count++;
        this.messages.push({ "index": this.count, "text": this.newMessage, "role": "user", "type": 1 });
        this.streaming = true;
        let payload = {
          question: this.newMessage
        }
        this.newMessage = '';
        const headers = {
          "Content-type": "application/json",
          "session-id": this.user_obj.id,
        }

        fetch('https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/langchain-chat/question', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        })
          .then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const readStream = () => {
              reader.read().then(({ done, value }) => {
                // console.log(value)
                if (done) {
                  // console.log('Stream complete');
                  this.count++;
                  let text = this.stream_msg;
                  if (text.includes('<fund-card>') && text.includes('</fund-card>')) {
                    let text_array = getChunk(this.stream_msg);
                    // console.log(text_array);
                    text_array.forEach(async (thisChunk) => {
                      // console.log(thisChunk);
                      if (thisChunk.includes('<fund-card>') && thisChunk.includes('</fund-card>')) {
                        let fund_name = extractFundName(thisChunk);
                        let fund_card = await Render(fund_name);
                        this.messages.push({ "index": this.count, "text": fund_card, "role": "ai", "type": 1, "feedback": false });
                      } else {
                        this.messages.push({ "index": this.count, "text": thisChunk, "role": "ai", "type": 0, "feedback": false });
                      }
                    });
                  } else {
                    this.messages.push({ "index": this.count, "text": this.stream_msg, "role": "ai", "type": 0, "feedback": false });
                  }
                  this.stream_msg = '';
                  this.streaming = false;
                  this.scrollToElement();
                  return;
                }

                const text = decoder.decode(value, { stream: true });
                // console.log(text);
                this.stream_msg = this.stream_msg + text;
                // Continue reading
                readStream();
                this.scrollToElement();

              });
            };
            readStream();
          })
          .catch(error => {
            console.error('Error:', error);
          });
        // Use the retrieved data here
      }
    },
    Clear() {
      console.log(this.user_obj.id + " CLEARED");
      fetch('https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/chat/' + this.user_obj.id, {
        method: 'DELETE',
        headers: {
          "Content-type": "application/json",
          "session-id": this.user_obj.id,
        }
      }).then(response => {
        // console.log(response);
        // alert("Chat cleared");
        this.messages = [];
        this.streaming = false;
      })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    Feedback(id) {
      let user_text_str = '';
      let ai_text_str = '';
      this.messages.forEach(element => {
        if (element.index == id - 1) {
          user_text_str = element.text;
        }
        else if (element.index == id) {
          ai_text_str = element.text;
          element.feedback = true;
        }
      });

      const bodyData = {
        user_text: user_text_str,
        ai_text: ai_text_str,
        user_id: this.user_obj.id,
      }
      console.log(this.user_obj.id + " FEEDBACK");
      fetch('https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/feedback/submit', {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          "session-id": this.user_obj.id,
        },
        body: JSON.stringify(bodyData)
      }).then(response => {
        // console.log(response);
        alert("Feedback submitted");
      })
        .catch(error => {
          console.error('Error:', error);
          alert("Feedback failed");
        });

    }
  },
})

// Vueapp.component('updown', updown);
Vueapp.mount('#app')