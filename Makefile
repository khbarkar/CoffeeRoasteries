PORT ?= 8000
DIR ?= .

.PHONY: run
run:
	@echo "Serving site at http://localhost:$(PORT)/ (directory: $(DIR))"
	@python3 -m http.server $(PORT) --directory $(DIR)

.PHONY: docs
docs:
	@$(MAKE) run DIR=docs
