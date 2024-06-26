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
To odpali sieć z włączonymi certyfikatami i kanałem `mychannel` na którym zostaną połączeni *org1* i *org2*. Następnie odpalamy smart-contract, Można odpalić ich testowy czyli:
```
./network.sh deployCC -ccn mysc -ccp ../../smart-contracts/ -ccl typescript
```
Natomiast lepiej już odpalić [nasz](https://github.com/blockovisco/smart-contracts), wtedy zamiast tej ścieżki u góry podajemy tą do folderu ze smart contractem. 


**Uwaga!** W pliku `src/blockchain/chaincode.ts` definiujemy nazwę smart kontraktu na jakim działamy (`const chaincodeName` gdzieś u góry pliku). Taką samą należy podać w komendzie u góry po argumencie *-ccn*. Na czas pisania tego to było `mysc` 

W tym momencie sieć powinna być zdatna do interakcji.

## Wyłączenie sieci

Gdy zmienimy coś w chaincodzie to trzeba zamknąć całą sieć i postawić nową
```
./network.sh down
```

## Odpalenie api
Umieścić __to__ repo w folderze np *my-api* w lokalizacji:
`fabric-samples/asset-transfer-basic/my-api` (chodzi o to aby z tego folderu do  `test-network` prowadziła lokalizacja `../../test-network`).
Wchodzimy do tego folderu, aby skompilować odpalamy `tsc`. Aby włączyć odpalamy
```
sudo npm start
```

## Endpointy
- ~~`/init` - tworzy jakies assety~~
- `/all` - zwraca wszystkie assety
- `/create/energy/{amount}` - tworzy asset energi i daje ownera jako tego kto ma identity w aplikacji
- `/create/ecoin/{amount}` - tworzy asset ecoina i daje ownera jako tego kto ma identity w aplikacji
- `/create/offer/{amount}/{price}` - tworzy ofertę sprzedaży energii, przyjmuje parametry ilość oraz cenę
- `/offers/` - zwraca wszystkie oferty
- `/exist/{id}` - zwraca informacje czy dany zasób o określonym id istnieje
- `/ecoins/{user}` - zwraca wszystkie assety ecoina które są powiązane z danym userem
- `/energy/{user}` - zwraca wszystkie assety energii które są powiązane z danym userem

## WSL
Jeżeli aplikacja nie może podłączyć się z API a testując API na localhost np. poprzez zapytanie `http://localhost:6060/all` działa, problemem możebyć nie udostępnienie portów poprzez WSL. Aby to zmienić można użyć komendy: 
```
netsh interface portproxy add v4tov4 listenport=[PORT] listenaddress=0.0.0.0 connectport=[PORT] connectaddress=[WSL_IP]
```
gdzie port to port który chcemy forwardować do naszego komputera, a WSL IP to IP które znajduje się w eth0 na WSL. Można je sprawdzić wpisując komende `ifconfig` w WSL i znajdować się będzie jako inet pod eth0.
