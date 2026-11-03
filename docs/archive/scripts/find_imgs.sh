#!/bin/bash
find_image() {
    local city=$1
    echo "Pesquisando $city..."
    local html=$(curl -s "https://unsplash.com/s/photos/$city")
    local ids=$(echo "$html" | grep -o 'photo-[0-9a-fA-F\-]*' | sort | uniq | head -n 15)
    for id in $ids; do
        status=$(curl -o /dev/null -s -w "%{http_code}" "https://images.unsplash.com/$id?q=80&w=100")
        if [ "$status" -eq 200 ]; then
            echo "$city ENCONTRADO: $id"
            return
        fi
    done
    echo "$city: Nenhuma encontrada."
}

find_image "sao-paulo"
find_image "buenos-aires"
find_image "dubai"
find_image "tokyo"
