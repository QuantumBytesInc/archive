/**
 * Shared Object between FaqController and FaqDetailController
 * which makes it possible to share the selected faq entry title to be displayed in the FaqDetailController.
 * @class FaqProps
 * @static
 * @constructor
 */
function FaqProps() {
  return {
    currentFaqTitle : ""
  }
}
