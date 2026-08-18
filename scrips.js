    const spreadsheetId =
        "2PACX-1vQWqgqmVvrzNaU1yGKM4GWlFkyXz0MqzEmZtlAs57Nx4t0DhKmDsOP4PWeWZSn8-TTnNzJWkbaP3WZX";

    const gid = "0";

    const csvUrl =
        `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?gid=${gid}&single=true&output=csv`;


    /*
     * ==============================
     * ATUALIZA AS TABELAS
     * ==============================
     */

    function atualizarTabelas() {

        // Adiciona um parâmetro para evitar cache
        const urlAtualizada =
            `${csvUrl}&t=${Date.now()}`;

        fetch(urlAtualizada)
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Não foi possível acessar a planilha."
                    );
                }

                return response.text();
            })

            .then(csv => {

                const rows = parseCSV(csv);


                /*
                 * ==============================
                 * PRIMEIRA TABELA — C1:J20
                 * ==============================
                 */

                const firstTableRows = rows
                    .slice(0, 20)
                    .map(row => row.slice(2, 10));

                createTable(
                    firstTableRows,
                    "machines-table",
                    true
                );


                /*
                 * ==============================
                 * SEGUNDA TABELA — A22:B26
                 * ==============================
                 */

                const secondTableRows = rows
                    .slice(21, 26)
                    .map(row => row.slice(0, 2));

                createTable(
                    secondTableRows,
                    "summary-table",
                    false
                );

            })

            .catch(error => {

                console.error(error);

                document.querySelector(
                    ".machines-table-container"
                ).innerHTML = `
                    <p style="
                        padding: 20px;
                        text-align: center;
                        color: #c62828;
                    ">
                        Não foi possível carregar o status dos computadores.
                    </p>
                `;
            });
    }


    /*
     * ==============================
     * PRIMEIRA ATUALIZAÇÃO
     * ==============================
     */

    atualizarTabelas();


    /*
     * ==============================
     * ATUALIZA A CADA 1 MINUTOS
     * ==============================
     */

    setInterval(atualizarTabelas, 60 * 1000);


    /*
     * ==============================
     * CRIA UMA TABELA HTML
     * ==============================
     */

    function createTable(rows, tableId, colorStatus) {

        if (rows.length === 0) {
            return;
        }

        const table = document.getElementById(tableId);

        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");


        /*
         * Limpa a tabela anterior
         * antes de inserir os novos dados.
         */

        thead.innerHTML = "";
        tbody.innerHTML = "";


        /*
         * Primeira linha = cabeçalho
         */

        const header = rows[0];

        thead.innerHTML = `
            <tr>
                ${header.map(column => `
                    <th>${escapeHTML(column)}</th>
                `).join("")}
            </tr>
        `;


        /*
         * Demais linhas = dados
         */

        rows.slice(1).forEach(row => {

            const tr = document.createElement("tr");

            row.forEach((cell, index) => {

                const td = document.createElement("td");


                /*
                 * Colore SOMENTE "Ativo"
                 * na coluna Status.
                 */

                if (
                    colorStatus &&
                    header[index] &&
                    header[index].trim().toLowerCase() === "status" &&
                    cell.trim() === "Ativo"
                ) {

                    td.classList.add("status-active");

                    td.innerHTML = `
                        ${escapeHTML(cell)}
                    `;

                } else {

                    td.textContent = cell;
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }


    /*
     * ==============================
     * PARSER CSV
     * ==============================
     */

    function parseCSV(csv) {

        const rows = [];

        let row = [];
        let value = "";
        let insideQuotes = false;

        for (let i = 0; i < csv.length; i++) {

            const char = csv[i];
            const next = csv[i + 1];

            if (
                char === '"' &&
                insideQuotes &&
                next === '"'
            ) {

                value += '"';
                i++;

            } else if (char === '"') {

                insideQuotes = !insideQuotes;

            } else if (
                char === "," &&
                !insideQuotes
            ) {

                row.push(value);
                value = "";

            } else if (
                char === "\n" &&
                !insideQuotes
            ) {

                row.push(value);
                rows.push(row);

                row = [];
                value = "";

            } else if (char !== "\r") {

                value += char;
            }
        }

        if (
            value !== "" ||
            row.length > 0
        ) {

            row.push(value);
            rows.push(row);
        }

        return rows;
    }


    /*
     * ==============================
     * SEGURANÇA
     * ==============================
     */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

