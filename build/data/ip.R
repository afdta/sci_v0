library(tidyverse)
library(readxl)
library(jsonlite)

fyle <- "/home/alec/Projects/Brookings/blogs/startup-complexity/build/data/complexity blog.xlsx"

techiest <- read_excel(fyle, sheet="Table 1", range="B6:F25", col_names=c("sci_rank", "sci", "metro", "share_crunch", "num_advantages"))
map_data <- read_excel(fyle, sheet="map 1", range="B10:E108", col_names=c("cbsa", "metro", "yf_per1000", "sci"))
corrs <- read_excel(fyle, sheet="chart 1", range="A11:D13", col_names=c("correlate", "ba_share", "pci", "sci"))

json <- toJSON(list(table=techiest, map=map_data, chart=corrs), digits=5, pretty=TRUE, na="null")

writeLines(json, con="/home/alec/Projects/Brookings/blogs/startup-complexity/assets/json/startup_complexity.json")
