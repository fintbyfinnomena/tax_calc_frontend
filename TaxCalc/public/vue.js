import { createApp } from 'vue'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
        name: '',
        email: '',
        profPic: '',
        access_token: '',
      },
      // loading: false,
      streaming: false,
      stream_msg : ''
    }
  },
  mounted: function () {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("user is authenticated")
          const uid = user.uid;
          this.user_obj.name = user.displayName;
          this.user_obj.email = user.email;
          this.user_obj.profPic = user.photoURL;
          this.user_obj.access_token = user.accessToken;
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
        console.log(error);
      });
    },
    addMessage() {
      // package the data and submit to api
      // console.log("test01")
      if (this.newMessage.trim() != "") {
        // console.log("test02")
        this.count++;
        this.messages.push({ "index": this.count, "text": this.newMessage, "role": "user" });
        let payload = {
          question: this.newMessage
        }
        this.newMessage = '';
        const headers = {
          "Content-type": "application/json",
          "Authorization": "Bearer " + this.user_obj.access_token
        }
        // this.loading = true;
        console.log(payload)

        // axios({
        //   method: 'post', url: 'https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/langchain-chat/basic-chat',
        //   data: payload, headers: headers
        // }).then((response) => {
        //   this.count++;
        //   this.messages.push({ "index": this.count, "text": response.data.data });
        //   this.loading = false;
        // }).catch((error) => {
        //   console.log(error);
        // });

        fetch('http://localhost:8080/api/v1/langchain-chat/basic-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const readStream = () => {
              reader.read().then(({ done, value }) => {
                this.streaming = true;
                if (done) {
                  console.log('Stream complete');
                  this.count++;
                  this.messages.push({ "index": this.count, "text": this.stream_msg, "role": "ai"});
                  // this.loading = false;
                  this.stream_msg = '';
                  this.streaming = false;
                  return;
                }

                const text = decoder.decode(value, { stream: true });
                console.log(text);
                this.stream_msg = this.stream_msg + text;
                // Continue reading
                readStream();
              });
            };
            readStream();
          })
          .catch(error => {
            console.error('Error:', error);
          });
        // Use the retrieved data here
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }
    },
  }
})

Vueapp.mount('#app')