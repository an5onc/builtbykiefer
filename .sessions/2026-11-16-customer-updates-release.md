# November 16 Customer Website Updates

Owner requested production deployment of the reviewed Lakehouse Remodel and latest website edits.

## Scope
- New /projects/lakehouse-remodel renovation tour,48optimizedWebPs/5.86MB/98.9%smaller. Original ZIP retained outside repository; one exact duplicate omitted. General Projects/renovation feature links and sitemap entry; absent from New Builds.
-12Lakehouse photos in matching Kitchens/Bathrooms/LivingSpaces/Exteriors sections. Existing unique renovation photos/elevator content retained.
- Timnath copy, metadata, category, captions and alts use Speakeasy. Speakeasies service uses3existing Timnath photos and a tour link;6category cards have balanced responsive layout.
- Process/specification sections and unused data removed from all7tours; Mountain Modern video retained.
- Barns/Garages card text-only. Retired photo removed from shared content, Mountain gallery and slideshow. Prior image/video privately backed up; old video URLs direct308to20261116edition. New video1280x720/703frames,16.9–19.2s replacement shot and synchronized visual descriptions. Decoded music SHA unchanged. Allother public assets preserved, including guide and Google ownership file.
- Fixed active renovation category on tall phone sections with passive, animation-frame-throttled tracking and aria-current.
- Release smoke now discovers the rendered selected video for its206byte-range check and asserts it exists in the release manifest. Previous hardcoded superseded URL correctly became308; no validation weakened.

## Validation
- Reviewed446-file digest e1e182c2a9cb1c0be61ade32cd4af434e5fb221252c7a4332ed884544a3762d4.
- CleanNode24.22.3/npm11.17.0 locked install;lint,12releaseguards,281unit tests,Next16.4.6build/types,zero production dependency vulnerabilities and GET-only smoke passed.
- Local desktop/320phone review: Timnath filter/keyboardlightbox, renovation sections/carousel/category navigation, text-only Barns card and native video seek18s.
- No form submissions/test emails; no DNS/env/keys/account/protection changes. Original dirty checkout and private historical records retained; release isolated on fresh remote main7e255bd.
- Source preparation included one EOF whitespace cleanup. Earlier smoke failures retained privately; final complete qualification passed without modifying product behavior to satisfy the harness.

## Handoff
Deployment target: existing KBuiltCo builtbykiefer project/kbuiltco.com via Git integration. User authorized production publication. Inspect Git/Vercel commit/status for actual current deployment. Do not infer release state from this source preparation note.

Replacement Barns/Garages photos remain pending owner. Previous Berthoud/Vetters attribution overlap remains a separate owner decision, unchanged. Existing RanchGallery warning and physical-device/assistive/slow-network checks remain separate limits.
