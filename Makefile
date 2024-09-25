commondir = ./common
book_json_targets_jekyll_find = $(shell find common/book-json -type f -name '*raw.json')
book_json_targets_jekyll = $(addprefix _data/,$(notdir $(book_json_targets_jekyll_find:-raw.json=.json)))

.PHONY: _includes/common _includes/faux site-all generate-pages site-local assets/split/partial

site-local: versioned-html faux _includes/common _includes/faux assets/figures assets/source assets/split/partial generate-pages generate-menus $(book_json_targets_jekyll)

site-all: versioned-html faux _includes/common _includes/faux assets/figures assets/source assets/split/partial generate-pages $(book_json_targets_jekyll) jekyll site

include $(commondir)/common.mk # versioned here, builds from source.md

faux: $(book_json_targets)
	python generate-faux-sources.py

apocrypha_rm: # so apocrypha.json is fresh every html build
	rm -f $(apocrypha_json)

_includes/common/online-resources-editable: $(commondir)/online-resources-editable # copy over online resources files
	rsync -a --delete --include '*/' --include '*source.md' --exclude '*' $(commondir)/online-resources-editable/ _includes/common/online-resources-editable/

_includes/common: $(commondir)/versioned # copy over built index.html files
	rsync -a --delete --include '*/' --include '*index.html' --exclude '*' $(commondir)/versioned/ _includes/common/

_includes/faux: $(commondir)/faux # copy over built index.html files
	rsync -a --delete --include '*/' --include '*index.html' --exclude '*' $(commondir)/faux/ _includes/faux/

assets/figures: _includes/common # copy over figure files
	rsync -a --include '*/' --include '*.svg' --include '*.jpg' --include '*.png' --exclude '*' $(commondir)/figures/ assets/figures/

assets/source: _includes/common # copy over figure files in source
	rsync -a --include '*/' --include '*.svg' --include '*.jpg' --include '*.png' --exclude '*' source/ assets/source/

assets/split/partial: common/split/partial # copy over section pdf and jpg files
	rsync -a --include '*/' --include '*.pdf' --include '*.jpg' --exclude '*' common/split/partial/ assets/split/partial/

common/split/partial: # So that the split/partial directory is created
	mkdir -p common/split/partial

$(book_json_targets_jekyll): $(book_json_targets) # copy over book-processed.json data
	rsync -a --update -u $< $@

generate-pages: _includes/common _includes/faux # generate jekyll pages that include index.html files
	python generate-pages.py
	$(MAKE) _includes/common/online-resources-editable

generate-menus: $(commondir)/versions-inherited-flat.json # generate jekyll pages that include index.html files
	python generate-menus.py

jekyll: generate-pages _includes/common/online-resources-editable
	bundle exec jekyll build

site: jekyll
	cd _site && \
	git add -A && \
	git commit -m 'auto-commit' && \
	git pull && \
	git push