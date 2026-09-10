/**
 * MODULE BASE DE DONNÉES - VERSION ULTRA-ROBUSTE
 * Projet : Formation Microsoft Word
 * Connexion : AirTable
 */

const AIRTABLE_BASE_ID = "appupo2s6akdsF9II";
const AIRTABLE_API_KEY = "patw9gaTz8EPbJlEh.77d3a347121e86e840e1b9425d38a4bb5d318fa721eaca10084a0a535f3d4f9c";
const AIRTABLE_TABLE_NAME = "Inscriptions";

async function recupererInscriptions() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
        });

        if (!response.ok) throw new Error(`Erreur serveur: ${await response.text()}`);

        const data = await response.json();
        if (data.records) {
            return data.records.map(record => {
                const f = record.fields;
                // On cherche le champ peu importe la casse (Nom, nom, NOM)
                const getVal = (keys) => {
                    for (let k of keys) {
                        if (f[k]) return f[k];
                    }
                    return "Non renseigné";
                };

                return {
                    nom: getVal(['Nom', 'nom', 'NOM']),
                    email: getVal(['Email', 'email', 'EMAIL']),
                    whatsapp: getVal(['WhatsApp', 'whatsapp', 'WHATSAPP']),
                    statut: getVal(['Statut', 'statut', 'STATUT']),
                    niveau: getVal(['Niveau', 'niveau', 'NIVEAU']),
                    date: record.createdTime || f.Date || f.date || " la date"
                };
            });
        }
        return [];
    } catch (error) {
        console.error("ERREUR:", error);
        return [];
    }
}

async function ajouterInscription(entry) {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: [{
                    fields: {
                        "NOM": entry.nom,
                        "EMAIL": entry.email,
                        "WHATSAPP": entry.whatsapp,
                        "STATUT": entry.statut,
                        "NIVEAU": entry.niveau,
                        "DATE": entry.date
                    }
                }]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }
        return true;
    } catch (error) {
        console.error("Erreur insertion:", error);
        alert("Erreur d'enregistrement : " + error.message);
        return false;
    }
}
