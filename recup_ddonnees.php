<?php
$host = 'localhost';
$dbname = 'serveur_connexions';
$username = 'root';
$password = '';

try {
    // Connexion PDO sécurisée
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En cas d'erreur de connexion
    die("Erreur de connexion : " . $e->getMessage());
}

// Sécuriser les entrées utilisateur
$adresse_ip = isset($_POST['adresse_ip']) ? trim($_POST['adresse_ip']) : '';
$mot_de_passe = isset($_POST['mot_de_passe']) ? trim($_POST['mot_de_passe']) : '';

// Vérifier que les champs ne sont pas vides
if (empty($adresse_ip) || empty($mot_de_passe)) {
    die('Veuillez remplir tous les champs.');
}

// Hachage du mot de passe
$mot_de_passe_hache = password_hash($mot_de_passe, PASSWORD_DEFAULT);

// Préparer et exécuter la requête d'insertion
try {
    $stmt = $pdo->prepare("INSERT INTO connexions (adresse_ip, mot_de_passe) VALUES (:adresse_ip, :mot_de_passe)");
    $stmt->execute([
        ':adresse_ip' => $adresse_ip,
        ':mot_de_passe' => $mot_de_passe_hache
    ]);

    echo "Connexion enregistrée avec succès !";
} catch (PDOException $e) {
    die("Erreur lors de l'enregistrement : " . $e->getMessage());
}
?>