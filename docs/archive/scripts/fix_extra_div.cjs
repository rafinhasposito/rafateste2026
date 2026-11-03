const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const brokenDivs = `                            </div>
                          </div>
                          </div>

                        </div>
                      </div>

                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;

const fixedDivs = `                            </div>
                          </div>

                        </div>
                      </div>

                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;

if (code.includes(brokenDivs)) {
    code = code.replace(brokenDivs, fixedDivs);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Fixed the extra closing div!");
} else {
    console.log("Could not find the exact broken divs string. Trying fallback.");
    // Fallback: Remove one `</div>` if there are 3 in a row before BLOCO 4.5
    const fallbackSearch = `</div>\n                          </div>\n                          </div>\n\n                        </div>`;
    if (code.includes(fallbackSearch)) {
        code = code.replace(fallbackSearch, `</div>\n                          </div>\n\n                        </div>`);
        fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
        console.log("Fixed using fallback.");
    }
}
