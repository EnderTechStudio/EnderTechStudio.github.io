<?php
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["fileToUpload"])) {
    $file = $_FILES["fileToUpload"];
    $target_file = $target_dir . basename($file["name"]);
    $uploadOk = 1;
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check file size (limit: 5MB)
    if ($file["size"] > 5 * 1024 * 1024) {
        echo "Error: File is too large.";
        $uploadOk = 0;
    }

    // Allow only certain file formats
    $allowed_types = ["jpg", "png", "gif", "pdf"];
    if (!in_array($fileType, $allowed_types)) {
        echo "Error: Only JPG, PNG, GIF, and PDF files are allowed.";
        $uploadOk = 0;
    }

    // Check if file already exists
    if (file_exists($target_file)) {
        $target_file = $target_dir . time() . "_" . basename($file["name"]); // Add timestamp to prevent overwrite
    }

    // Upload file if all checks pass
    if ($uploadOk == 1) {
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            echo "Success: The file " . htmlspecialchars(basename($file["name"])) . " has been uploaded.";
        } else {
            echo "Error: File upload failed.";
        }
    }
}
?>
