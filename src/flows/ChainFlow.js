import { useState } from "react";

import CommitmentForm from "../components/commitments/CommitmentForm";
import CommitmentList from "../components/commitments/CommitmentList";
import ChainBuilder from "../components/chains/ChainBuilder";

import ChainValidationModal from "../modals/ChainValidationModal";
import MatchPreviewModal from "../modals/MatchPreviewModal";

import { buildChain } from "../api/chainApi";

function ChainFlow() {
  const [selectedCommitment, setSelectedCommitment] = useState(null);
  const [chainData, setChainData] = useState(null);

  const [showValidation, setShowValidation] = useState(false);
  const [showMatchPreview, setShowMatchPreview] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleCommitmentCreated = () => {
    setSelectedCommitment(null);
    setChainData(null);
  };

  const handleCommitmentSelected = (commitment) => {
    setSelectedCommitment(commitment);
    setChainData(null);
  };

  const handleBuildChain = async () => {
    if (!selectedCommitment) return;

    try {
      setLoading(true);

      const result = await buildChain(
        selectedCommitment.id
      );

      setChainData(result);
      setShowValidation(true);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMatchPreview = () => {
    setShowMatchPreview(true);
  };

  return (
    <div className="d-flex flex-column gap-4">

      {/* Step 1 — Create commitment */}
      <CommitmentForm
        onSuccess={handleCommitmentCreated}
      />

      {/* Step 2 — Select commitment */}
      <CommitmentList
        onSelect={handleCommitmentSelected}
      />

      {/* Step 3 — Build chain */}
      {selectedCommitment && (
        <ChainBuilder
          commitment={selectedCommitment}
          onBuild={handleBuildChain}
          loading={loading}
        />
      )}

      {/* Step 4 — Validate chain */}
      <ChainValidationModal
        show={showValidation}
        onClose={() => setShowValidation(false)}
        chainData={chainData}
      />

      {/* Step 5 — Preview matching */}
      <MatchPreviewModal
        show={showMatchPreview}
        onClose={() => setShowMatchPreview(false)}
        chainData={chainData}
      />

      {/* Step 6 — Open preview button */}
      {chainData && (
        <button
          className="btn btn-outline-primary"
          onClick={handleOpenMatchPreview}
        >
          Preview Fulfillment Plan
        </button>
      )}
    </div>
  );
}

export default ChainFlow;