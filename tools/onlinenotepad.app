<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SwiftNote - Online Notepad</title>
    <meta http-equiv="refresh" content="0;url=onlinenotepad/index.html">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .loader {
            border: 4px solid rgba(91, 76, 196, 0.3);
            border-radius: 50%;
            border-top: 4px solid #5B4CC4;
            border-bottom: 4px solid #C12E61;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            margin-bottom: 10px;
        }
        p {
            color: #aaaaaa;
        }
    </style>
</head>
<body>
    <div>
        <div class="loader"></div>
        <h1>Loading SwiftNote...</h1>
        <p>If you are not redirected automatically, <a href="onlinenotepad/index.html" style="color: #5B4CC4;">click here</a>.</p>
    </div>
    <script>
        window.location.href = "onlinenotepad/index.html";
    </script>
</body>
</html>
