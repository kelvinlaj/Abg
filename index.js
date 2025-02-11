const { exec } = require("child_process");
const fs = require("fs");

// Fungsi untuk menjalankan tmate dan mendapatkan link SSH
function startTmate() {
  console.log("⚙️ Memulai sesi tmate...");

  // Periksa apakah tmate tersedia di sistem
  exec("which tmate", (error, stdout, stderr) => {
    if (error || !stdout) {
      console.error("❌ tmate tidak ditemukan! Pastikan tmate sudah terinstal.");
      return;
    }

    // Jika tmate ditemukan, jalankan sesi tmate baru
    const tmateCommand = "tmate -S /tmp/tmate.sock new-session -d";

    exec(tmateCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error menjalankan tmate: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ Stderr: ${stderr}`);
      }

      // Tunggu tmate siap
      console.log("✅ Sesi tmate dimulai, menunggu tmate siap...");

      // Dapatkan link SSH dari tmate
      exec("tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}'", (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`⚠️ Stderr: ${stderr}`);
        }

        const sshLink = stdout.trim();
        console.log(`🔗 Link SSH tmate: ${sshLink}`);

        // Simpan link SSH tmate ke dalam file
        const filePath = "/home/container/tmate_session.txt";  // Ganti dengan path yang bisa diakses
        fs.appendFile(filePath, `Sesi tmate baru: ${sshLink}\n`, (err) => {
          if (err) {
            console.error("❌ Gagal menyimpan sesi ke file:", err);
          } else {
            console.log(`✅ Sesi tmate berhasil disimpan ke file di ${filePath}.`);
          }
        });
      });
    });
  });
}

// Jalankan fungsi untuk memulai tmate
startTmate();
