# Jak to odpalić
## Wymagania
- trzeba mieć sklonowane repo [fabric-samples](https://github.com/hyperledger/fabric-samples). 
- linux albo wsl(sieć można odpalić tylko na unixie)

## Odpalenie sieci
Przechodzimy `test-network` (w *fabric-samples*) i odpalamy skrypt(jeżeli wasz docker potrzebuje sudo to tu też sudo). 
Wykonujemy:
```
./network.sh up createChannel -c mychannel -ca
```
To odpali sieć z włączonymi certyfikatami i kanałem `mychannel` na którym zostaną połączeni *org1* i *org2*. Następnie odpalamy smart-contract:
```
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript
```
W tym momencie sieć powinna być zdatna do interakcji.

## Odpalenie api
Umieścić __to__ repo w folderze np *my-api* w lokalizacji(chodzi o to aby z tego folderu do  `test-network` prowadziła lokalizacja `../../test-network`):
`fabric-samples/asset-transfer-basic/my-api`.
Wchodzimy do tego folderu, aby skompilować odpalamy `tsc`. Aby włączyć odpalamy
```
sudo npm start
```

## Endpointy
- init - tworzy jakies assety
- all - zwraca wszystkie assety