package ILMT::PAN::HIN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "Morph",
    "POSTagger",
    "Chunker",
    "Prune",
    "GuessMorph",
    "PickOneMorph",
    "ComputeHead",
    "ComputeVibhakti",
    "SimpleParser",
    "TransferGrammar",
    "LexicalTransfer",
    "Transliteration",
    "UTF2WX"
);

my $langpair_obj = new_translator ILMT::Translator("PAN", "HIN", \@seq);
