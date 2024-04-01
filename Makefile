up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

cert:
	mkcert -install
	mkcert -key-file key.pem -cert-file cert.pem example.com *.example.com localhost 127.0.0.1
