const { exec } = require("child_process");
const fs = require("fs");

// Fungsi untuk memulai SSH dan tmate
function startSSHAndTmate() {
  console.log("⚙️ Memulai SSH dan tmate...");

  // Periksa apakah tmate terinstal
  exec("which tmate", (error, stdout, stderr) => {
    if (error || !stdout) {
      console.error("❌ tmate tidak ditemukan! Pastikan tmate sudah terinstal.");
      return;
    }

    // Jika tmate ditemukan, jalankan SSH dan tmate
    const startCommand = `
      service ssh start;  # Memulai SSH service
      tmate -S /tmp/tmate.sock new-session -d;  # Membuat session tmate baru
      tmate -S /tmp/tmate.sock wait tmate-ready;  # Tunggu sampai tmate siap
    `;

    // Jalankan perintah
    exec(startCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ Stderr: ${stderr}`);
      }

      console.log("✅ SSH dan tmate berhasil dijalankan.");
    });

    // Dapatkan link tmate
    getTmateSSHLink();
  });
}

// Fungsi untuk mendapatkan link SSH dari tmate
function getTmateSSHLink() {
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
    fs.appendFile("/home/container/tmate_session.txt", `Sesi tmate baru: ${sshLink}\n`, (err) => {
      if (err) {
        console.error("❌ Gagal menyimpan sesi ke file:", err);
      } else {
        console.log("✅ Sesi tmate berhasil disimpan ke file.");
      }
    });
  });
}

// Mulai SSH dan tmate
startSSHAndTmate();
