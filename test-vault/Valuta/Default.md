---
convert: 4160
convertnegative: 15950
gold: 50
platium: 1
electrum: 0
silver: 22
copper: 0
simplify_gold: 178
simplify_silver: 9
test: 50
---
---
convert: 4160
convertnegative: 15950
gold: 50
platium: 1
electrum: 0
silver: 22
copper: 0
simplify_gold: 0
simplify_silver: 22
---
```ttrpgstats-valuta
id: test
convert: true
valutas:
- platium: 1000 
- gold: 100
- electrum: 50
- silver: 10
- copper: 1
```

****
## Allow negative
```ttrpgstats-valuta
id: test
allowNegative: true
displayNull: false
valutas:
- platium: 1000 
- gold: 100
- electrum: 50
- silver: 10
- copper: 1
```

# Simplify / Cross-denomination
```ttrpgstats-valuta
valutas:
- simplify_gold: 100
- simplify_silver: 10
```
*Start with 22 silver, click Simplify → becomes 2 gold 2 silver. Remove 1 gold with 0 gold → borrows from silver.*

# Convert
```ttrpgstats-valuta
id: convert
convert: true
displayNull: false
valutas:
- platium: 1000 
- gold: 100
- electrum: 50
- silver: 10
- copper: 1
```

## Allow negative
```ttrpgstats-valuta
id: convertnegative
allowNegative: true
convert: true
valutas:
- platium: 1000 
- gold: 100
- electrum: 50
- silver: 10
- copper: 1
```
