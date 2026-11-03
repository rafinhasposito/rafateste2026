#!/bin/bash
find_image() {
    local city=$1
    local html=$(curl -s "https://unsplash.com/s/photos/$city")
    local ids=$(echo "$html" | grep -o 'photo-[0-9a-fA-F\-]*' | sort | uniq | head -n 15)
    for id in $ids; do
        status=$(curl -o /dev/null -s -w "%{http_code}" "https://images.unsplash.com/$id?q=80&w=100")
        if [ "$status" -eq 200 ]; then
            echo "$id"
            return
        fi
    done
}
echo "Buscando Los Angeles..."
echo "LA: $(find_image "los-angeles")"
echo "Buscando Paris..."
echo "Paris: $(find_image "paris")"
echo "Buscando Roma..."
echo "Roma: $(find_image "rome")"
echo "Buscando Londres..."
echo "Londres: $(find_image "london")"
echo "Buscando Bali..."
echo "Bali: $(find_image "bali")"
