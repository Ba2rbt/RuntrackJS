<?php
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';
    
    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email et mot de passe obligatoires']);
        exit;
    }
    
    try {
        $query = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
        $query->execute([$email]);
        $user = $query->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
            exit;
        }
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['firstname'] . ' ' . $user['lastname'];
        
        echo json_encode(['success' => true, 'message' => 'Connexion réussie']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}

?>
