.PHONY: help install dev build start lint clean format watch

NODE_MODULES := node_modules
PACKAGE_MANAGER := npm

BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m

install:
	@echo "$(BLUE)Installation des dépendances...$(NC)"
	$(PACKAGE_MANAGER) install

dev:
	@echo "$(BLUE)Démarrage du serveur de développement...$(NC)"
	$(PACKAGE_MANAGER) run dev

build:
	@echo "$(BLUE)Build de l'application...$(NC)"
	$(PACKAGE_MANAGER) run build

start:
	@echo "$(BLUE)Démarrage de l'application...$(NC)"
	$(PACKAGE_MANAGER) start

lint:
	@echo "$(BLUE)Vérification du code avec eslint...$(NC)"
	$(PACKAGE_MANAGER) run lint

format:
	@echo "$(BLUE)Formatage du code...$(NC)"
	$(PACKAGE_MANAGER) run format || echo "$(YELLOW)prettier non installé$(NC)"

clean:
	@echo "$(BLUE)Nettoyage...$(NC)"
	rm -rf .next
	rm -rf build
	rm -rf dist
	@echo "$(GREEN)Nettoyage terminé$(NC)"

clean-deps:
	@echo "$(YELLOW)Suppression de node_modules...$(NC)"
	rm -rf $(NODE_MODULES)
	$(PACKAGE_MANAGER) install
	@echo "$(GREEN)Dépendances réinstallées$(NC)"

watch:
	@echo "$(BLUE)Watch mode activé...$(NC)"
	$(PACKAGE_MANAGER) run dev