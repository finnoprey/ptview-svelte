<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geolocation Finder</title>
</head>
<body>
  <h1>Please allow access to your location!</h1>
  <p>We're trying to figure out where you are.</p>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        };

        function success(pos) {
          const crd = pos.coords;
          window.location.href = '/?latitude=' + crd.latitude + '&longitude=' + crd.longitude;
        }

        function error(err) {
          alert('ERROR(' + err.code + '): ' + err.message);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    });
  </script>
</body>
</html>
