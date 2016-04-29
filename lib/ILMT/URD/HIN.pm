package ILMT::URD::HIN;
use strict;
use warnings;
use Data::Dumper;
use ILMT::Translator;

my @seq = (
    "Tokenizer",
    "UTF2WX_U"
);

my $langpair_obj = new_translator ILMT::Translator("URD", "HIN", \@seq);
