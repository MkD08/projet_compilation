const ipInput = document.getElementById("ip");
const passwordInput = document.getElementById("password");
const form = document.getElementById("form_connexion");

// Créer messages dynamiques
function createFeedback(input) {
    const container = document.createElement("div");
    container.style.position = "relative";

    input.parentNode.insertBefore(container, input);
    container.appendChild(input);

    const feedback = document.createElement("p");
    feedback.style.fontSize = "0.85em";
    feedback.style.margin = "5px 0 0 0";

    container.appendChild(feedback);

    return feedback;
}

const ipFeedback = createFeedback(ipInput);
const passwordFeedback = createFeedback(passwordInput);

// Shake animation
function shakeInput(input) {
    input.classList.add("shake");
    setTimeout(() => {
        input.classList.remove("shake");
    }, 300);
}

// Regex IPv4 et IPv6
const regexIPv4Partial = /^(\d{1,3}\.?){0,3}\d{0,3}$/;
const regexIPv4Full = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const regexIPv6Partial = /^([0-9a-fA-F]{0,4}:?){0,7}[0-9a-fA-F]{0,4}$/;
const regexIPv6Full = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

// Regex mot de passe
const regexPasswordStart = /^[A-Z]/;
const regexPasswordFull = /^[A-Z].{8,} $/;

// Validation IP en direct
ipInput.addEventListener("input", function () {
    const ip = ipInput.value.trim();

    if (ip === "") {
        ipInput.style.borderColor = "";
        ipFeedback.textContent = "";
        return;
    }

    // Vérifie si un des blocs est > 255
    if (ip.includes(".")) {
        const blocs = ip.split(".");
        for (let bloc of blocs) {
            if (bloc && !isNaN(bloc) && parseInt(bloc) > 255) {
                ipInput.style.borderColor = "red";
                ipFeedback.textContent = "Erreur : Un des blocs de l'adresse dépasse 255.";
                ipFeedback.style.color = "red";
                shakeInput(ipInput);
                return;
            }
        }
    }

    if (!regexIPv4Partial.test(ip) && !regexIPv6Partial.test(ip)) {
        ipInput.style.borderColor = "red";
        ipFeedback.textContent = "Erreur : Format invalide. L'adresse ne peut pas contenir ce que vous avez saisi.";
        ipFeedback.style.color = "red";
        shakeInput(ipInput);
    } else if (regexIPv4Full.test(ip) || regexIPv6Full.test(ip)) {
        ipInput.style.borderColor = "green";
        ipFeedback.textContent = "Adresse IP valide ! Continuez.";
        ipFeedback.style.color = "green";
    } else {
        ipInput.style.borderColor = "orange";
        ipFeedback.textContent = "Saisie en cours... Continuez, vous êtes sur la bonne voie.";
        ipFeedback.style.color = "orange";
    }
});

// Validation mot de passe en direct
passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;

    if (password === "") {
        passwordInput.style.borderColor = "";
        passwordFeedback.textContent = "";
        return;
    }

    if (!regexPasswordStart.test(password)) {
        passwordInput.style.borderColor = "red";
        passwordFeedback.textContent = "Erreur : Le mot de passe doit commencer par une Majuscule.";
        passwordFeedback.style.color = "red";
        shakeInput(passwordInput);
    } else if (regexPasswordFull.test(password)) {
        passwordInput.style.borderColor = "green";
        passwordFeedback.textContent = "Mot de passe valide !";
        passwordFeedback.style.color = "green";
    } else {
        passwordInput.style.borderColor = "orange";
        passwordFeedback.textContent = "Continuez, vous êtes sur la bonne voie.";
        passwordFeedback.style.color = "orange";
    }
});

// Validation finale au moment d'envoyer
form.addEventListener("submit", function (e) {
    const ip = ipInput.value.trim();
    const password = passwordInput.value;

    let ipValid = regexIPv4Full.test(ip) || regexIPv6Full.test(ip);
    let passwordValid = regexPasswordFull.test(password);

    if (!ipValid || !passwordValid) {
        e.preventDefault();
        if (!ipValid) {
            ipInput.style.borderColor = "red";
            ipFeedback.textContent = "Erreur : Adresse IP complète invalide.";
            ipFeedback.style.color = "red";
            shakeInput(ipInput);
        }
        if (!passwordValid) {
            passwordInput.style.borderColor = "red";
            passwordFeedback.textContent = "Erreur : Mot de passe final invalide.";
            passwordFeedback.style.color = "red";
            shakeInput(passwordInput);
        }
    }
});

// Afficher le message de succès si l'URL contient "status=success"
window.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
        const successDiv = document.getElementById("successMessage");
        if (successDiv) successDiv.style.display = "block";
    }
});
