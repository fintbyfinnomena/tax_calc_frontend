import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

document.getElementById('mybutton').addEventListener('click', () => {
    signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(result.user.email);
            // var obj = { "AccessToken": token, "Email": result.user.email, "Name": result.user.displayName, "Photo": result.user.photoURL };
            // sessionStorage.setItem("GoogleUserObject", JSON.stringify(obj));
            window.location.href = "chat.html";
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(error)
            // ...
        });
});


