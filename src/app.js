require('dotenv').config();

function goToScreen(screenId) {
  // Nasconde tutte le sezioni
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Mostra solo la sezione con l'ID specificato
  const targetSection = document.getElementById(screenId);
  if (targetSection) {
    targetSection.classList.add('active');

    // Effettua lo scroll fluido con un offset per evitare che venga coperta
    const offset = -100; // Modifica questo valore per aggiustare l'altezza dello scroll
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY + offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

function calcoloCommissioni(controvalore) {
  const commissione = controvalore * 0.001;
  if (commissione < 5) {
    return 5;
  } else if (commissione > 15) {
    return 15;
  } else {
    return commissione;
  }
}

function calcolaPrezzoAcquisto(valoreNominale, prezzoVA, rateoLordo) {
  const controvalore = valoreNominale * prezzoVA;
  const controvaloreInteressi = valoreNominale * rateoLordo;
  const impostaSostitutivaRateo = controvaloreInteressi * 0.125;
  const speseBancarie = 2.70;
  const commissioniVendita = calcoloCommissioni(controvalore);

  const prezzoAcquisto = controvalore + controvaloreInteressi + commissioniVendita + speseBancarie - impostaSostitutivaRateo;

  return {
    "Prezzo d'acquisto": `${prezzoAcquisto.toFixed(2)}€`,
    "Controvalore in euro dei titoli": `${controvalore.toFixed(2)}€`,
    "Controvalore in euro degli interessi": `${controvaloreInteressi.toFixed(2)}€`,
    "Imposta sostitutiva rateo interessi": `<span style="color:red; font-weight: bold;">${-impostaSostitutivaRateo.toFixed(2)}€</span>`,
    "Spese bancarie": `<span style="color:red; font-weight: bold;">${-speseBancarie.toFixed(2)}€</span>`,
    "Commissione (0,10% sul controvalore)": `${commissioniVendita.toFixed(2)}€`,
  };
}

function calcolaGuadagno(prezzoAcquisto, valoreNominale1, prezzoVA1, rateoLordo1) {
  const controvalore = valoreNominale1 * prezzoVA1;
  const controvaloreInteressi = valoreNominale1 * rateoLordo1;
  const impostaSostitutivaRateo = controvaloreInteressi * 0.125;
  const speseBancarie = 2.70;
  const commissioniVendita = calcoloCommissioni(controvalore);

  const guadagnoLordo = controvalore + controvaloreInteressi - speseBancarie - impostaSostitutivaRateo - commissioniVendita - prezzoAcquisto;
  const ricavoLordo = controvalore + controvaloreInteressi - speseBancarie - impostaSostitutivaRateo - commissioniVendita;

  return {
    "Prezzo d'acquisto": `${prezzoAcquisto.toFixed(2)}€`,
    "Controvalore in euro dei titoli": `${controvalore.toFixed(2)}€`,
    "Controvalore in euro degli interessi": `${controvaloreInteressi.toFixed(2)}€`,
    "Imposta sostitutiva rateo interessi": `<span style="color:red; font-weight: bold;">${(-impostaSostitutivaRateo).toFixed(2)}€</span>`,
    "Commissione (0,10% sul controvalore)": `<span style="color:red; font-weight: bold;">${(-commissioniVendita).toFixed(2)}€</span>`,
    "Spese bancarie": `<span style="color:red; font-weight: bold;">${(-speseBancarie).toFixed(2)}€</span>`,
    "Ricavo lordo": `${ricavoLordo.toFixed(2)}€`,
    "Guadagno lordo": `${guadagnoLordo.toFixed(2)}€`
  };
}

function mostraPrezzoAcquisto() {
  const valoreNominale = parseFloat(document.getElementById("valoreNominale").value);
  const prezzoVA = parseFloat(document.getElementById("prezzoVA").value);
  const rateoLordo = parseFloat(document.getElementById("rateoLordo").value);

  const risultato = calcolaPrezzoAcquisto(valoreNominale, prezzoVA, rateoLordo);

  // Inserisce i risultati nell'area dedicata
  const risultatoDiv = document.getElementById("risultatoAcquisto");
  risultatoDiv.innerHTML = Object.entries(risultato).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');
}

function mostraGuadagno() {
  const prezzoAcquisto = parseFloat(document.getElementById("prezzoAcquisto").value);
  const valoreNominale1 = parseFloat(document.getElementById("valoreNominale1").value);
  const prezzoVA1 = parseFloat(document.getElementById("prezzoVA1").value);
  const rateoLordo1 = parseFloat(document.getElementById("rateoLordo1").value);

  const risultato = calcolaGuadagno(prezzoAcquisto, valoreNominale1, prezzoVA1, rateoLordo1);

  // Inserisce i risultati nell'area dedicata
  const risultatoDiv = document.getElementById("risultatoGuadagno");
  risultatoDiv.innerHTML = Object.entries(risultato).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');
}

function reset() {
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  document.querySelectorAll('.risultato').forEach(risultato => {
    risultato.innerHTML = '';
  });
} 

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("focus", function() {
      this.dataset.placeholder = this.placeholder; // Salva il placeholder
      this.placeholder = "";
  });
  input.addEventListener("blur", function() {
      this.placeholder = this.dataset.placeholder; // Ripristina il placeholder
  });
});

async function sendMessage() {
  const input = document.getElementById('userInput').value;
  const responseDiv = document.getElementById('response');
  if (!input) {
    responseDiv.innerHTML = 'Please enter a message.';
    return;
  }
  responseDiv.innerHTML = 'Loading...';
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://grisopatateecozze.github.io/',
          'X-Title': 'BTP calculator',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwq-32b:free',
          messages: [{ role: 'user', content: input }],
        }),
      },
    );
    const data = await response.json();
    console.log(data);
    const markdownText =
      data.choices?.[0]?.message?.content || 'No response received.';
    responseDiv.innerHTML = marked.parse(markdownText);
  } catch (error) {
    responseDiv.innerHTML = 'Error: ' + error.message;
  }
}

function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('open'); // Aggiunge o rimuove la classe 'open' per mostrare/nascondere il menu
}

