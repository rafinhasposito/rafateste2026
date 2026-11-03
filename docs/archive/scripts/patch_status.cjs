const fs = require('fs');
const file = '.agents/release/status.json';

if (fs.existsSync(file)) {
  let status = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  // Clear blockers related to DestinyResults UI
  status.human_blocker = false;
  status.human_blocker_reason = "";
  
  if (status.notes) {
    status.notes = status.notes + " | DestinyResults UI & Protocol Card APPROVED by User.";
  }
  
  fs.writeFileSync(file, JSON.stringify(status, null, 2));
  console.log("Status updated.");
}
