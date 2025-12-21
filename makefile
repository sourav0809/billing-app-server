dev:
	docker-compose -f docker-compose.dev.yaml up server --build --force-recreate --renew-anon-volumes --remove-orphans

down:
	docker-compose -f docker-compose.dev.yaml down -v --remove-orphans
