function goToScreen(screenId) {
  // Nasconde tutte le sezioni
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Mostra solo la sezione con l'ID specificato
  document.getElementById(screenId).classList.add('active');
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
    "Imposta sostitutiva rateo interessi": `${impostaSostitutivaRateo.toFixed(2)}€`,
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

  return {
    "Prezzo d'acquisto": `${prezzoAcquisto.toFixed(2)}€`,
    "Controvalore in euro dei titoli": `${controvalore.toFixed(2)}€`,
    "Controvalore in euro degli interessi": `${controvaloreInteressi.toFixed(2)}€`,
    "Imposta sostitutiva rateo interessi": `${(-impostaSostitutivaRateo).toFixed(2)}€`,
    "Commissione (0,10% sul controvalore)": `${(-commissioniVendita).toFixed(2)}€`,
    "Spese bancarie": `${(-speseBancarie).toFixed(2)}€`,
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


