# TODO: Fix Git Merge Conflicts & Server Errors

## ✅ Frontend NPM Fixed
- [x] package.json → Valid JSON syntax
- [x] package-lock.json → Removed merge conflict markers
- [ ] Delete root pnpm-lock.yaml (causing Next.js confusion)
- [ ] `npm run dev` → Ready (minor pnpm warnings)

## 🚨 Backend FastAPI CRITICAL
- [ ] `app/main.py` → **STILL has merge conflict markers** (lines 34, 58, 66, etc)
  - `uvicorn main:app` fails with **SyntaxError**
- [ ] Test: `cd app && uvicorn main:app --reload`

## ⚠️ Other Files
- [ ] `Frontend/lib/constants.ts` → Clean minor markers
- [ ] `Frontend/app/layout.tsx` → Verify merge correct

## Next Steps
1. **Delete** `c:/project final/pnpm-lock.yaml` 
2. **Fix** `app/main.py` completely (remove ALL `<<<<<<< ======= >>>>>>>`)
3. Test servers:
```powershell
# Backend
cd "c:/project final/app"
uvicorn main:app --reload

# Frontend  
cd "c:/project final/Frontend"
npm run dev
```
4. Git commit clean project

**Priority: Backend main.py → uvicorn must work first!**

