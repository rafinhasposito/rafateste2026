const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// The issue is around line 1188 where the closing tags got messed up.
// Let's strip out the end of the file from after "Rotas Alternativas" and rewrite it cleanly.

const rotasAltEndMatch = code.indexOf('</div>\n                      </div>\n\n                    </div>\n               </div>\n            </div>');
if (rotasAltEndMatch !== -1) {
    console.log("Found bad closing blocks. Rewriting properly.");
    code = code.substring(0, rotasAltEndMatch) + `</div>\n                      </div>\n\n                    </div>\n                  )}\n               </div>\n            </div>\n          \n</Reveal>\n        </div>\n      </section>\n\n\n\n      \n      <style dangerouslySetInnerHTML={{__html: \`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}\`}} />\n    </div>\n  );\n}\n`;
    fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
}
