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
        loading: false
      }
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
      if (this.newMessage.trim() != "") {
        this.count++;
        this.messages.push({ "index": this.count, "text": this.newMessage });
        this.newMessage = '';
        let payload = {
          question: this.newMessage
        }
        const headers = {
          "Content-type": "application/json",
          "Authorization": "Bearer " + this.user_obj.access_token
        }
        this.loading = true;
        axios({ method: 'post', url: 'https://nest-langchain-tax-ai-mk27cugt3a-as.a.run.app/api/v1/langchain-chat/basic-chat', data: payload , headers: headers}).then((response) => {
          this.count++;
          this.messages.push({ "index": this.count, "text": response.data });
          this.loading = false;
        }).catch((error) => {
          console.log(error);
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