window.onload = () => {

    const form = document.getElementById("registerForm") as HTMLFormElement;
    const msgDiv = document.getElementById("mensagem") as HTMLDivElement;

    form.addEventListener("submit", async (e: Event) => {
        e.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        interface RegisterPayload {
            username: string;
            email: string;
            password: string;
        }

        const payload: RegisterPayload = {
            username,
            email,
            password,
        };

        try {
            const resp = await fetch(backendAddress + "accounts/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (resp.ok) {
                const data = await resp.json() as { token: string; msg: string };

                // Enregistre token
                localStorage.setItem("token", data.token);

                msgDiv.innerHTML = "✔️ Conta criada com sucesso!";

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1500);

            } else {
                const erro = await resp.json();
                msgDiv.innerHTML = "❌ Erro: " + JSON.stringify(erro);
            }

        } catch (error) {
            console.error("Erro de rede:", error);
            msgDiv.innerHTML = "❌ Erro ao comunicar com o servidor.";
        }

    });
};
