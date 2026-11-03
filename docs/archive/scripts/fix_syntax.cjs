const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// I need to add the missing closing divs right before BLOCO 4.5.
// Let's find exactly where the error is.
// Right now, the code probably looks like this:
/*
                            </div>
                          </div>
                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}
                      <div className="w-full max-w-6xl mx-auto mt-32 mb-48 px-6 text-center flex flex-col items-center relative">
*/

// Let's replace the broken transition
const brokenTransition = `                            </div>
                          </div>
                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;

const fixedTransition = `                            </div>
                          </div>

                        </div>
                      </div>

                      {/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;

if (code.includes(brokenTransition)) {
    code = code.replace(brokenTransition, fixedTransition);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Fixed missing closing divs!");
} else {
    // Let's just do a manual substring fix if it doesn't match exactly.
    const searchString = `{/* BLOCO 4.5: O MANTRA DE ATIVAÇÃO (GRADIENTE CINEMÁTICO) */}`;
    if (code.includes(searchString) && !code.includes(`</div>\n                      </div>\n\n                      {/* BLOCO 4.5`)) {
         code = code.replace(searchString, `  </div>\n                      </div>\n\n                      ` + searchString);
         fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
         console.log("Fixed missing closing divs using generic replace!");
    } else {
         console.log("Could not find where to fix.");
    }
}
