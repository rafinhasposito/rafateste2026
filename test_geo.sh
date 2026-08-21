#!/bin/bash
check_city() {
  local birth=$1
  local res=$(curl -s -X POST "https://protocolo-solar-api.onrender.com/audit_past" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Test\", \"place_of_birth\": \"$birth\", \"dob\": \"01/01/1990\", \"time\": \"12:00\", \"target_year\": 2024, \"past_city\": \"Paris\", \"past_lat\": 48.8566, \"past_lon\": 2.3522}")
  
  if echo "$res" | grep -q "house"; then
    echo "$birth -> PASS"
  else
    echo "$birth -> FAIL ($res)"
  fi
}
check_city "Surubim, Pernambuco, Brasil"
check_city "São Paulo, SP, Brasil"
check_city "Recife, PE, Brasil"
check_city "New York, NY, USA"
