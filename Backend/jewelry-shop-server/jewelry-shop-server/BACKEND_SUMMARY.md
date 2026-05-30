# Backend Summary — TSM Project

**Overview**

- Backend stack: Java 17 (Temurin 17), Spring Boot 3.2.6, Maven, Hibernate ORM 6.4.8, HikariCP, PostgreSQL.
- Project location: `Backend/jewelry-shop-server/jewelry-shop-server`.
- Database: PostgreSQL database `tsm` (default connection used in `application.yml`).

**What I implemented / fixed**

- Environment & run:
  - Ensured the project runs on **Java 17** (added a local JDK and updated `run_backend.ps1` to use it).
  - Added `-parameters` compiler flag to `maven-compiler-plugin` and used `mvn clean spring-boot:run` to avoid stale compiled classes.
- Endpoints implemented and exercised:
  - Products: `/api/products` (GET/POST/PUT/DELETE)
  - Product categories: `/api/product-categories` (GET/POST)
  - Suppliers: `/api/suppliers` (GET/POST/DELETE)
  - Services: `/api/services` (GET/POST)
  - Customers: `/api/customers` (GET/POST)
  - Purchase receipts: `/api/purchase-receipts` (create + updates product stock)
  - Service tickets: `/api/service-tickets` (create + details)
  - Invoices: `/api/invoices` (basic endpoints present)
- DB seeding and test data:
  - Imported sample rows via manual `psql` inserts and partially imported `Database/data/script_generate_data/seed_data.sql`.
  - Created product category and product via API to test trading flows.
  - Inserted `users` row via `psql` to allow creating receipts (the backend expects a valid `user_id`).
- Bug fixes / workarounds applied:
  - Resolved runtime Java version mismatch (project needs Java 17).
  - Fixed Spring parameter reflection issue by adding `-parameters` to compiler plugin and rebuilding.
  - For seed import I converted a copy of the SQL file (encoding issues) and handled partial imports.

**Manual tests I ran (selected)**

- Created a `supplier` via POST `/api/suppliers` and verified the row in PostgreSQL.
- Created `product category` and `product` via API; verified GET `/api/products`.
- Created a `purchase receipt` via POST `/api/purchase-receipts` after inserting a `user`; verified stock update and receipt rows.
- Attempted to create `service ticket` via API; observed DB constraint failures (see Known Issues).

**Known issues / items not fixed yet**

- Encoding / seed import:
  - `seed_data.sql` contains Windows-1252 / ANSI encoded Vietnamese characters that caused garbled text when imported to a UTF-8 PostgreSQL database.
  - I created a UTF-8 copy and ran imports, but some bytes could not be converted cleanly; recommendation: open the original file in VS Code, Reopen with Encoding → `Western (Windows 1252)`, then Save with Encoding → `UTF-8` and re-import into a clean DB.
- `service_ticket_details` constraints:
  - `delivery_date` is NOT NULL — requests must include `deliveryDate` for each detail.
  - `status` is constrained by a CHECK to a limited set of values (`'ĐÃ GIAO'` or `'CHƯA GIAO'`). Tests failed when the status sent did not match exactly (accents/ASCII mismatch). I temporarily expanded acceptance during testing, but the correct approach is to ensure the frontend sends exact localized values or to centralize status values as an enum.
- Frontend-related gaps:
  - Some UI forms (service ticket creation) must include additional fields required by DB (e.g., `deliveryDate`, valid `status`, `userId`). Until the frontend sends the required values, API calls from the UI may fail.
  - Hydration warning in Customers page (React SSR/HMR artifact) — cosmetic.

**Files I removed (temporary/unused)**

- `.scripts/convert_seed.ps1` — temporary PowerShell used to convert the seed file encoding.
- (I did not remove `Database/data/script_generate_data/seed_data.sql` — this is the canonical seed file.)
- `Database/schema/database_utf8.sql` — duplicate/converted schema (garbled in this repo), removed to avoid confusion.
- `Database/schema/database_utf8_nobom.sql` — duplicate/converted schema (garbled in this repo), removed to avoid confusion.

**Which schema file to use**

- Use `Database/schema/database.sql` as the canonical schema file. It is UTF-8 and contains correct Vietnamese text (recommended for importing into PostgreSQL UTF-8 databases).
- If you have an external build or deployment that required a no‑BOM file, create a UTF‑8 (no BOM) copy from `database.sql` when packaging, but keep only `database.sql` in the repo to avoid duplicates.

**Commands & quick checks**

```powershell
cd Backend/jewelry-shop-server/jewelry-shop-server
# uses run_backend.ps1 which sets local JAVA_HOME and runs mvn clean spring-boot:run
powershell -NoProfile -ExecutionPolicy Bypass -File .\\run_backend.ps1
```

```bash
psql "postgresql://postgres:29102006@localhost:5432/tsm" -f "Database/data/script_generate_data/seed_data.sql"
```

```bash
psql "postgresql://postgres:29102006@localhost:5432/tsm" -c "\dt"
psql "postgresql://postgres:29102006@localhost:5432/tsm" -c "SELECT * FROM suppliers LIMIT 10;"
psql "postgresql://postgres:29102006@localhost:5432/tsm" -c "SELECT * FROM service_ticket_details LIMIT 10;"
```

---

**Clone & Run (quickstart)**

- **Prerequisites**: Java 17 (Temurin 17 recommended), Maven or the included `mvnw`, PostgreSQL (local), `psql` client.
- **Default DB**: the app expects a PostgreSQL database named `tsm` and connection settings in `src/main/resources/application.yml` (update if you use different credentials/host/port).

- Create the database (example):

```bash
# create DB and user (adjust password/user as needed)
psql -U postgres -c "CREATE DATABASE tsm;"
psql -U postgres -c "CREATE USER tsm_user WITH PASSWORD 'change_me';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tsm TO tsm_user;"
```

- Import schema (recommended):

```bash
# from repository root
psql "postgresql://postgres:yourpassword@localhost:5432/tsm" -f "Database/schema/database.sql"
```

- Note on seed data encoding: `Database/data/script_generate_data/seed_data.sql` is originally Windows-1252/ANSI. Convert to UTF-8 before importing if your DB is UTF-8. In VS Code: Reopen with Encoding → `Western (Windows 1252)` then Save with Encoding → `UTF-8`.

- Run backend (PowerShell helper prefers local bundled JDK if present):

```powershell
cd Backend/jewelry-shop-server/jewelry-shop-server
# uses run_backend.ps1 which sets JAVA_HOME (prefers .tools/temurin17) and runs mvn clean spring-boot:run
powershell -NoProfile -ExecutionPolicy Bypass -File .\run_backend.ps1
```

- If you prefer Maven directly (ensure Java 17 in your PATH):

```bash
cd Backend/jewelry-shop-server/jewelry-shop-server
./mvnw clean spring-boot:run    # on Windows use .\mvnw.cmd if present, or 'mvn' if installed
```

- Quick checks after startup:

```bash
# app should listen on http://localhost:8080
curl -s http://localhost:8080/api/products | jq .
curl -s http://localhost:8080/actuator/health
```

- Troubleshooting tips:
  - If Spring fails with reflection/parameter-name errors, run `mvn clean` and ensure `maven-compiler-plugin` contains `-parameters` (already configured in this branch).
  - For `service-ticket` errors, ensure requests include `deliveryDate`, `userId`, and use the exact localized `status` values expected by DB (or change DB enum/constraint to match your locale).
