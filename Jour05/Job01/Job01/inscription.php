<?php
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $nom = isset($data['nom']) ? trim($data['nom']) : '';
    $prenom = isset($data['prenom']) ? trim($data['prenom']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    $adresse = isset($data['adresse']) ? trim($data['adresse']) : '';
    $codePostal = isset($data['codePostal']) ? trim($data['codePostal']) : '';
    
    if (!$nom || !$prenom || !$email || !$password || !$adresse || !$codePostal) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires']);
        exit;
    }
    
    $emailRegex = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
    if (!preg_match($emailRegex, $email)) {
        echo json_encode(['success' => false, 'message' => 'Email invalide']);
        exit;
    }
    
    $codePostalRegex = '/^[0-9]{5}$/';
    if (!preg_match($codePostalRegex, $codePostal)) {
        echo json_encode(['success' => false, 'message' => 'Code postal invalide']);
        exit;
    }
    
    try {
        $checkEmail = $pdo->prepare("SELECT COUNT(*) FROM utilisateurs WHERE email = ?");
        $checkEmail->execute([$email]);
        $emailExists = $checkEmail->fetchColumn();
        
        if ($emailExists > 0) {
            echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
            exit;
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $query = $pdo->prepare("
            INSERT INTO utilisateurs (firstname, lastname, email, password, address, postal_code)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $query->execute([$prenom, $nom, $email, $hashedPassword, $adresse, $codePostal]);
        
        echo json_encode(['success' => true, 'message' => 'Inscription réussie']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}

?>
