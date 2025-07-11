---
health_max: 1
hitdice: 1
slots: 1
---
# Tracker button
```ttrpgstats-button
buttons:
 - name: Rest
   id: short
   color: green
 - name: Long
   id: long
   color: red
```


# Trackers
```ttrpgstats-tracker
id: 'hitdice'
name: 'Hit Dice'
max: 5
color: blue
reset: 
- "long"
```


```ttrpgstats-tracker
id: 'slots'
name: 'Spell slots'
max: 3
color: green
reset: 
- "long"
```
