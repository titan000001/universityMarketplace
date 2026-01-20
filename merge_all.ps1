$branches = git branch -r | Where-Object { $_ -notmatch 'HEAD|main' } | ForEach-Object { $_.Trim() }

$merged = @()
$skipped = @()

foreach ($branch in $branches) {
    Write-Host "Attempting to merge $branch..." -ForegroundColor Cyan
    $output = git merge $branch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully merged $branch" -ForegroundColor Green
        $merged += $branch
    } else {
        Write-Host "Conflict merging $branch. Aborting..." -ForegroundColor Red
        git merge --abort
        $skipped += $branch
    }
}

Write-Host "`nSummary:" -ForegroundColor White
Write-Host "Merged Branches: $($merged.Count)" -ForegroundColor Green
$merged | ForEach-Object { Write-Host " - $_" -ForegroundColor Green }

Write-Host "Skipped (Conflict) Branches: $($skipped.Count)" -ForegroundColor Red
$skipped | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
