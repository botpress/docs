CHANGED_FILES=$(shell \
  (git diff --name-only master...HEAD; \
   git ls-files --modified --others --exclude-standard) \
   | sort -u | grep -E '\.(md|mdx)$$' || true \
)

check-writing:
	@echo "🔍 Looking for changed Markdown or MDX files..."
	@if [ -n "$(CHANGED_FILES)" ]; then \
		echo "📝 Running Vale on: $(CHANGED_FILES)"; \
		vale $(CHANGED_FILES); \
	else \
		echo "✅ No changed Markdown or MDX files found."; \
	fi