import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://ojuaruhvnrqtrmkwcoln.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdWFydWh2bnJxdHJta3djb2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMjU0NjMsImV4cCI6MjA5NzgwMTQ2M30.yJH9FFO_XZ4LN_Cqxx_D9nz1NJj5dFEn4kuRBc_Hfb4"
)