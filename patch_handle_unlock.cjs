const fs = require('fs');
const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// We want to remove the setSelectedHouse(targetHouse) call from inside handleUnlock.
// But ONLY inside handleUnlock.

const oldStr = `      setConsultation(refreshedConsultation as ConsultationRow);
      await refreshProfile();
      showAlert(\`Casa \${targetHouse} desbloqueada com sucesso.\`);
      setSelectedHouse(targetHouse);
    } catch (error: any) {`;

const newStr = `      setConsultation(refreshedConsultation as ConsultationRow);
      await refreshProfile();
      showAlert(\`Casa \${targetHouse} desbloqueada com sucesso.\`);
      // Não mudamos o selectedHouse automaticamente para permitir que o usuário destrave várias casas seguidas no grid sem perder a navegação
    } catch (error: any) {`;

content = content.replace(oldStr, newStr);

fs.writeFileSync(file, content);
console.log("Patched handleUnlock in Dashboard.tsx to not force navigation.");
