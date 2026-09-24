const fs = require('fs');
const file = 'src/pages/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `      setConsultation(refreshedConsultation as ConsultationRow);
      await refreshProfile();
      showAlert(\`Casa \${targetHouse} desbloqueada com sucesso.\`);
      // Não mudamos o selectedHouse automaticamente para permitir que o usuário destrave várias casas seguidas no grid sem perder a navegação
    } catch (error: any) {`;

const newStr = `      setConsultation(refreshedConsultation as ConsultationRow);
      await refreshProfile();
      showAlert(\`Casa \${targetHouse} desbloqueada com sucesso.\`);
      setSelectedHouse(targetHouse);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {`;

content = content.replace(oldStr, newStr);

fs.writeFileSync(file, content);
console.log("Reverted handleUnlock and added window.scrollTo");
