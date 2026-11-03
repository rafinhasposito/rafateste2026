const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const target = `                  ))}
                </AnimatePresence>
              </motion.div>

                  </div>`;

const replacement = `                  ))}
                </AnimatePresence>
              </div>

                  </div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Closing tag fixed!");
} else {
    console.log("Closing tag NOT found!");
}
