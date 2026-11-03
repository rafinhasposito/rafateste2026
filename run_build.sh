#!/bin/bash
# Release Captain Build Script
cd "/Users/rafaelsposito/Desktop/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate"
echo "=== BUILD START ===" && date
npm run build 2>&1
echo "=== BUILD EXIT CODE: $? ===" && date
